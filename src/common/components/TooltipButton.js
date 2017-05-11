'use strict'

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated
} from 'react-native'
import UI from '../utils/ui'

export default class TooltipButton extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isShow: false,
      opacity: new Animated.Value(0)
    }
  }

  layout = null
  timeOut = null

  showTooltip (value) {
    const { messages, timeOut } = this.props
    const { isShow } = this.state

    let showTooltip = !!(!isShow && messages && value)

    if (showTooltip) {
      this.playAnimate()
      this.setState({
        isShow: true
      })
      if (timeOut) {
        this.timeOut = setTimeout(() => {
          this.playAnimate(0, () => {
            this.setState({
              isShow: false
            })
          })
        }, timeOut)
      }
    } else {
      this.playAnimate(0, () => {
        this.setState({
          isShow: false
        })
      })
    }
  }

  playAnimate (value = 1, callback = null, duration = 300) {
    Animated
      .timing(this.state.opacity, {
        toValue: value,
        duration
      })
      .start(() => {
        if (callback) {
          callback()
        }
      })
  }

  _onPress (e) {
    const { onPress } = this.props
    if (onPress) {
      onPress(e)
    }
  }

  _onLayout (e) {
    this.layout = e.nativeEvent.layout
  }

  _onLayoutTap () {
    this.setState({
      isShow: false
    })
  }

  componentWillReceiveProps (nextProps) {
    const { isShow } = this.state

    if (nextProps.show && nextProps.show !== isShow) {
      this.showTooltip(nextProps.show)
    }
  }

  render () {
    const { style, children, messages } = this.props
    const { isShow } = this.state

    return (
      <View onLayout={(e) => this._onLayout(e)} style={styles.container}>
        {isShow && (<View onStartShouldSetResponder={() => true} onResponderGrant={() => this._onLayoutTap()} style={styles.overlay} />)}
        <TouchableOpacity style={style} onPress={(e) => this._onPress(e)} >
          {children}
        </TouchableOpacity>
        {isShow && (
          <Animated.View
            style={[
              styles.tooltipsContainer,
              { bottom: this.layout.height + 5 },
              { opacity: this.state.opacity }
            ]}
          >
            {messages.map((item, index) => {
              return item && (<View style={styles.tooltipsItem} key={index}><Text>{item}</Text></View>)
            })}
          </Animated.View>
        )}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  tooltipsContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    flex: 1,
    width: undefined,
    height: undefined,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderWidth: 2
  },
  tooltipsItem: {
    minWidth: 250,
    flex: 1,
    padding: 10
  },
  overlay: {
    flex: 1,
    width: UI.size.width * 2,
    height: UI.size.height * 2,
    position: 'absolute',
    backgroundColor: '#fff',
    opacity: 0,
    left: -UI.size.width,
    top: -UI.size.height
  }
})
