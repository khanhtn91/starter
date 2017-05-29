import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Easing
} from 'react-native'

class ProgressBarComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isShow: false,
      progress: new Animated.Value(0.99),
      blocking: props.blocking || DEFAULT_BLOCKING_MODE
    }
    this.windowWidth = Dimensions.get('window').width
  }

  componentWillMount () {
    ProgressBarComponent.instance = this
  }

  componentWillUnmount () {
    //delete ProgressBarComponent.instance
  }

  show (blocking) {
    const { progress } = this.state
    progress.setValue(0.99)
    this.setState({
      isShow: true,
      blocking
    })
    Animated.timing(progress, {
      easing: Easing.bezier(0.04, 0.9, 0.11, 0.9),
      duration: ANIMATED_DURATION,
      toValue: ANIMATION_TO_VALUE
    }).start()
  }

  hide () {
    const { progress } = this.state
    Animated.timing(progress, {
      easing: Easing.inOut(Easing.ease),
      duration: FAST_ANIMATED_DURATION,
      toValue: ANIMATION_TO_VALUE
    }).start(() =>
      this.setState({
        isShow: false,
        blocking: DEFAULT_BLOCKING_MODE
      })
    )
  }

  onLayout (event) {
    if (this.windowWidth !== event.nativeEvent.layout.width) {
      this.windowWidth = event.nativeEvent.layout.width
    }
  }

  render () {
    const { isShow, blocking } = this.state
    const fillWidth = this.state.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0 * this.windowWidth, 1 * this.windowWidth]
    })

    if (!isShow) {
      return null
    }

    return (
      <View style={styles.background} onLayout={event => this.onLayout(event)}>
        {(isShow && blocking) && <View style={styles.overlay} />}
        <Animated.View style={[styles.fill, { marginRight: fillWidth }]} />
      </View>
    )
  }
}

const ANIMATED_DURATION = 12000
const FAST_ANIMATED_DURATION = 300
const ANIMATION_TO_VALUE = 0
const DEFAULT_BLOCKING_MODE = true

const ProgressBar = {
  Component: ProgressBarComponent,
  show (blocking = DEFAULT_BLOCKING_MODE) {
    const { instance } = ProgressBarComponent
    console.log(instance)
    instance && instance.show(blocking)
  },
  hide () {
    const { instance } = ProgressBarComponent
    instance && instance.hide()
  }
}

const styles = StyleSheet.create({
  background: {
    top: 0,
    left: 0,
    zIndex: 9999,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'absolute'
  },
  fill: {
    height: 5,
    backgroundColor: '#ff9024'
  },
  overlay: {
    zIndex: 999,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'transparent'
  }
})

export default ProgressBar
