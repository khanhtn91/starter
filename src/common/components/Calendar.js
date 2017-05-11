'use strict'

import React, { Component } from 'react'
import {
  View,
  LayoutAnimation
} from 'react-native'
import Dates from 'react-native-dates'
import Moment from 'moment'
import styles from '../styles/Page'

export default class PopupCalendar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillUpdate () {
    const { visible } = this.props
    if (!visible) {
      LayoutAnimation.easeInEaseOut()
    }
  }

  render () {
    const { position, visible, _onChange, minDate, maxDate, selectStartDate, selectEndDate } = this.props

    const isDateBlocked = (date) => {
      if (!minDate && !maxDate) {
        return false
      }
      if (minDate && maxDate) {
        return !date.isBetween(Moment(minDate), Moment(maxDate))
      }
      if (!minDate && maxDate) {
        return date.isAfter(Moment(maxDate), 'day')
      }
      if (minDate && !maxDate) {
        return date.isBefore(Moment(maxDate), 'day')
      }
    }
      // date.isBefore(Moment(), 'day')
      // console.log(date.isBefore(Moment(), 'day')); return !date.isBetween(new Date(2017, 2, 12), new Date(2017, 2, 17))
    if (!visible) {
      return <View />
    }

    return (
      <View 
	    style={[{
		  position: 'absolute',
		  backgroundColor: '#fff',
		  width: 400 }, 
		  position
	    ]}>
        <Dates
          range
          startDate={Moment(selectStartDate)}
          endDate={Moment(selectEndDate)}
          isDateBlocked={isDateBlocked}
          onDatesChange={(date) => {
            if (_onChange) {
              _onChange(date)
            }
          }}
        />
      </View>
    )
  }
}
