'use strict'

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'
import SearchInput from './SearchInput'

export default class SearchPanel extends Component {
  render () {
    const { mStyle, placeholder, disabled } = this.props

    return (
      <View style={mStyle}>
        <View style={styles.container}>
          <SearchInput
            icon={'md-search'}
            placeholder={placeholder}
          />
          <TouchableOpacity disabled={disabled} style={disabled ? styles.disabledSearchButton : styles.searchButton}>
            <Text style={disabled ? styles.disabledButtonText : styles.buttonText}> Search </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  searchButton: {
    backgroundColor: '#000',
    width: 70,
    height: 30,
    margin: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 3
  },
  disabledSearchButton: {
    backgroundColor: '#ccc',
    width: 70,
    height: 30,
    margin: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 3
  },
  buttonText: {
    color: '#ccc'
  },
  disabledButtonText: {
    color: '#000'
  }
})
