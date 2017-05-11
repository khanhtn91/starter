import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Actions } from 'react-native-router-flux'
import styles from '../common/styles/Page'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    const { props } = this

    return (
      <View>
		<Text>
		  Hello
		</Text>
	  </View>
    )
  }
}