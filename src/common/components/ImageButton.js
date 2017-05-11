'use strict'

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  Text
} from 'react-native'

export default class ImageButton extends Component {
  constructor (props) {
    super(props)

    this.state = {
      image: this.props.appearance.normal
    }
  }

  onTouchStart () {
    const { toggle } = this.props
    const { image } = this.state

    if (!toggle) {
      this.setState({
        image: this.props.appearance.highlight
      })
    } else if (image === this.props.appearance.highlight) {
      this.setState({
        image: this.props.appearance.normal
      })
    } else {
      this.setState({
        image: this.props.appearance.highlight
      })
    }
  }

  onTouchEnd () {
    const { toggle } = this.props

    if (!toggle) {
      this.setState({ image: this.props.appearance.normal }, () => {
        if (this.props.onPress) {
          setTimeout(this.props.onPress)
        }
      })
    } else {
      if (this.props.onPress) {
        setTimeout(this.props.onPress)
      }
    }
  }

  onTouchCancel () {
    this.setState({
      image: this.props.appearance.normal
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      image: nextProps.appearance.normal
    })
  }

  render () {
    const { style, title, colorFont } = this.props

    return (
      <View style={style}
        onStartShouldSetResponder={() => true}
        onResponderGrant={this.onTouchStart.bind(this)}
        onResponderRelease={this.onTouchEnd.bind(this)}
        onResponderTerminate={this.onTouchCancel.bind(this)}
        onResponderReject={this.onTouchCancel.bind(this)}
      >
        <Image style={styles.image} source={this.state.image} resizeMode='stretch' />
        {title && (
          <View style={[style, styles.title]}>
            <Text style={{ color: colorFont || '#fff' }}>{title}</Text>
          </View>
        )}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  image: {
    flex: 1,
    width: null,
    height: null
  },
  title: {
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
