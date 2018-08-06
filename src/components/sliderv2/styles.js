import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
  dot: {
    width: 5,
    height: 5,
    backgroundColor: 'white',
    bottom: 20,
    margin: 5,
    borderRadius: 2.5,
    opacity: 0.3,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width,
  },
  background: {
    width,
    height,
    position: 'absolute',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 200,
  },
})
