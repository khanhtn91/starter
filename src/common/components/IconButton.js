'use strict'

import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from '../styles/Page'

export default class IconButton extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { icon, type, text, color, containerStyle, textStyle, iconSize, onPress } = this.props

    return (
      <TouchableOpacity 
	    style={[{justifyContent: 'space-around', alignItems: 'center'}, containerStyle]} 
		onPress={onPress}
      >
        {type === 'ionic' && (<Icon name={icon} size={iconSize} color={color} />)}
        {type === 'material' && (<MIcon name={icon} size={iconSize} color={color} />)}
        <Text style={textStyle}> {text} </Text>
      </TouchableOpacity>)
  }
}
