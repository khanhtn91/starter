import React, { Component } from 'react'
import {
  View,
  TextInput,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class SearchInput extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { placeholder, icon } = this.props

    return (
      <View style={[styles.container, styles.searchInputWrapper]}>
        <View style={styles.iconStyle}>
          <Icon name={icon} size={20} color='#ccc' />
        </View>
        <TextInput
          placeholder={placeholder}
          style={styles.searchCustomer}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: undefined,
    flex: 1,
    height: 30
  },
  searchInputWrapper: {
    borderColor: '#808080',
    borderWidth: 2,
    padding: 0,
    height: 36,
    borderRadius: 1
  },
  searchCustomer: {
    height: 30,
    borderWidth: 0,
    marginLeft: 30
  },
  iconStyle: {
    width: 30,
    height: 32,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f2f2f5',
    position: 'absolute'
  }
})
