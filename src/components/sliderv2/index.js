import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Animated,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native'
import _ from 'lodash'
import Tags from '../tags'

import api from '../../api'
import styles from './styles'

const colors = ['#f8a5c2', '#778beb', '#f19066', '#63cdda']
const { width, height } = Dimensions.get('window')

const keyExtractor = item => (item.index.toString())
const renderItem = ({ item }) => (
  <View
    style={styles.slide}
  >
    <Image
      source={item.image}
      style={styles.image}
    />
  </View>
)

class SliderV2 extends Component {
  constructor(props) {
    super(props)

    this.nScroll = new Animated.Value(0)

    const items = Object.values(api).reduce((acc, model) => {
      const localItems = model.items.map(item => ({ ...item, key: model.title }))
      acc.push(...localItems)
      return acc
    }, [])

    const tags = Object.values(api).map(item => item.title)
    const newItems = items.map((item, index) => {
      const color = colors[index % colors.length]
      return ({ ...item, index, color })
    })

    const last = { ...newItems[0] }
    const first = { ...newItems[newItems.length - 1] }
    newItems.push(last)
    newItems.unshift(first)

    const reIndexItems = newItems.map((item, index) => ({ ...item, index }))

    this.state = {
      index: 1,
      tags,
      data: reIndexItems,
      maxIndex: reIndexItems.length - 1,
    }
  }

  componentDidMount() {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      this.list.scrollToIndex({ index: 1, animated: false });
    });
  }

  onMomentumScrollEnd(e) {
    const { maxIndex } = this.state
    const { contentOffset, layoutMeasurement } = e.nativeEvent
    const localIndex = Math.floor(contentOffset.x / layoutMeasurement.width)
    const index = localIndex < 0 ? 0 : localIndex

    if (index === 0) {
      this.scrollTo(maxIndex - 1)
      this.setState({ index: maxIndex - 1 })
      return null
    }

    if (index === maxIndex) {
      this.scrollTo(1)
      this.setState({ index: 1 })
      return null
    }

    this.setState({ index })
    return null
  }

  getCategoryItems() {
    const { data, index } = this.state
    const phoneKey = data[index].key
    const newData = [...data]
    newData.pop()
    newData.shift()
    return _.uniqBy(newData.filter(item => item.key === phoneKey), 'title')
  }

  findAndScrollTo(key) {
    const { data, index } = this.state
    const phones = data.filter(item => item.key === key)
    const phone = phones[0].index === 0 ? phones.reverse()[1] : phones[0]
    if (phone.index !== index) this.scrollTo(phone.index, true)
  }

  scrollTo(index, animated = false) {
    setTimeout(() => { this.list.scrollToIndex({ index, animated }) }, 0)
  }

  render() {
    const { data, tags, index: dataIndex } = this.state

    const color = this.nScroll.interpolate({
      inputRange: [...data.map((_item, index) => (width * index))],
      outputRange: [...data.map(item => item.color)],
    })

    return (
      <SafeAreaView
        style={{
          width,
          height,
        }}
      >
        <Animated.View
          style={[
            { backgroundColor: color },
            styles.background,
          ]}
        />
        <Tags
          active={data[dataIndex].key}
          tags={tags}
          onPress={(key) => { this.findAndScrollTo(key) }}
        />
        <FlatList
          ref={(ref) => { this.list = ref }}
          onScrollToIndexFailed={() => {}}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => { this.onMomentumScrollEnd(e) }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.nScroll } } }])}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />

        <View style={styles.dotContainer}>
          {this.getCategoryItems().map(item => (
            <Animated.View
              key={item.index}
              style={[
                styles.dot,
                item.index === dataIndex && {
                  opacity: 1,
                },
              ]}
            />
          ))}
        </View>
      </SafeAreaView>
    )
  }
}

export default SliderV2
