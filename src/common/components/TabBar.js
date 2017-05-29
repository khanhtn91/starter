'use strict'

import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class TabBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.selected ? props.selected : 2,
      icons: [
        {
          id: 1,
          title: 'Category',
          icon: 'ios-albums-outline',
          action: () => {
            props.Actions.category()
          }
        },
        {
          id: 2,
          title: 'News',
          icon: 'ios-paper-plane-outline',
          action: () => {
            props.Actions.news()
          }
        },
        {
          id: 3,
          title: 'Personal',
          icon: 'ios-person-outline',
          action: () => {
            props.Actions.bookmarks()
          }
        }
      ]
    }
  }

  render () {
    const { icons, selected } = this.state

    return (
      <View style={styles.container}>
        {icons && icons.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => item.action()}
            style={{
              flex: 1,
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            <Icon name={item.icon} size={20} color={selected === item.id ? 'red' :'black'} />
            <Text>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row'
  }
})
