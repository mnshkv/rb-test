import React from 'react'
import uuid from 'uuid/v4'
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

import styles from './styles'

const Tags = (props) => {
  const { tags, onPress, active } = props
  return (
    <View
      style={styles.box}
    >
      <ScrollView
        horizontal
      >
        {tags.map(item => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            key={uuid()}
            style={styles.block}
          >
            <Text
              style={[
                styles.text,
                active === item && { fontWeight: '600' },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

Tags.defaultProps = {
  tags: [],
  onPress: () => {},
  active: '',
}

export default Tags
