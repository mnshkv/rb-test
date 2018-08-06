import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
  box: {
    position: 'absolute',
    width,
    height: 60,
    top: 30,
    zIndex: 4,
  },
  block: {
    padding: 10,
    margin: 5,
  },
  text: {
    color: '#fff',
  },
})
