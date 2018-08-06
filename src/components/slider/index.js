import React, { PureComponent } from 'react'
import {
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native'

import Tags from '../tags'
import api from '../../api'

const { width, height } = Dimensions.get('window')

const colors = ['#f8a5c2', '#778beb', '#f19066', '#63cdda']

class Slider extends PureComponent {
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


    this.state = {
      tags,
      data: newItems,
      index: 0,
      maxIndex: newItems.length - 1,
      minIndex: 0,
    }
  }

  componentDidMount() {
    setTimeout(() => { this.list.scrollTo({ x: width, animated: false }) }, 0)
  }

  onMomentumScrollEnd(e) {
    const { contentOffset, layoutMeasurement } = e.nativeEvent
    const localIndex = Math.floor(contentOffset.x / layoutMeasurement.width)

    if (localIndex === 2) {
      this.getNext()
    }

    if (localIndex === 0) {
      this.getPrev()
    }
  }

  setWidth() {
    this.list.scrollTo({ x: width, animated: false })
  }

  getNext(setIndex = null) {
    const {
      index,
      maxIndex,
    } = this.state

    if (setIndex != null) {
      const id = setIndex > 0 ? setIndex - 1 : maxIndex
      this.list.scrollTo({ x: width * 2, animated: true })
      this.setState({ index: id }, () => {
        this.setWidth()
      })

      return null
    }

    let newIndex = index
    if (index === maxIndex) {
      newIndex = 0
      this.setState({ index: newIndex }, () => {
        this.setWidth()
      })
      return null
    }

    if (newIndex < maxIndex) {
      newIndex += 1
      this.setState({ index: newIndex }, () => {
        this.setWidth()
      })
    }
    return null
  }

  getPrev() {
    const {
      index,
      minIndex,
      maxIndex,
    } = this.state

    let newIndex = index

    if (index > minIndex) {
      newIndex -= 1
      this.setState({ index: newIndex }, () => {
        this.setWidth()
      })
      return null
    }

    if (index === minIndex) {
      newIndex = maxIndex
    }

    this.setState({ index: newIndex }, () => {
      this.setWidth()
    })
    return null
  }

  getData() {
    const { data, index } = this.state
    const right = this.right()
    const center = data[index]
    const left = this.left()
    return [left, center, right]
  }

  findAndSet(key) {
    const { data } = this.state
    const phone = data.find(item => item.key === key)
    this.getNext(phone.index)
  }

  left() {
    const {
      index,
      minIndex,
      data,
      maxIndex,
    } = this.state

    if (index > minIndex) {
      const localIndex = index - 1
      return data[localIndex]
    }

    if (index === minIndex) {
      return data[maxIndex]
    }

    return null
  }

  right() {
    const { index, maxIndex, data } = this.state

    if (index >= maxIndex) {
      const localIndex = 0
      return data[localIndex]
    }

    if (index <= maxIndex) {
      const localIndex = index + 1
      return data[localIndex]
    }

    return null
  }

  render() {
    const { tags } = this.state
    const data = this.getData()

    const color = this.nScroll.interpolate({
      inputRange: [...data.map((_, index) => (width * index))],
      outputRange: [...data.map(item => item.color)],
    })

    return (
      <SafeAreaView>
        <Animated.View
          style={{
            width,
            height,
            position: 'absolute',
            backgroundColor: color,
          }}
        />
        <Tags tags={tags} onPress={(key) => { this.findAndSet(key) }} />
        <ScrollView
          scrollEventThrottle={16}
          ref={(ref) => { this.list = ref }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.nScroll } } }])}
          horizontal
          pagingEnabled
          onMomentumScrollEnd={(e) => { this.onMomentumScrollEnd(e) }}
          showsHorizontalScrollIndicator={false}
        >
          {data.map(item => (
            <View
              key={item.index}
              style={{
                width, height, alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Image
                source={item.image}
                style={{ width: 100, height: 200 }}
              />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Slider
