/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import { View, StyleSheet } from 'react-native'

// import Slider from './src/components/slider'
import Slider from './src/components/sliderv2'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const App = () => (
  <View style={styles.container}>
    <Slider />
  </View>
)

export default App
