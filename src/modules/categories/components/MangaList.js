'use strict'

import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ListView
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Card, Button } from 'react-native-elements'

import { controllerNews } from '../../../common/utils/controller'

export default class MangaList extends Component {
  constructor (props) {
    super(props)
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    let source = this.dataSource.cloneWithRows(props.list)
    this.listView = null
    this.category = 'All'
    this.state = {
      source: source,
      list: props.list,
      page: 1,
    }
  }

  async getList (page, category, sort, remove = false, list = []) {
    let link = ''
    link = `http://hamtruyen.vn/danhsach@category@P${page}/index.html?sort=${sort}`
    if (category !== 'All') {
      link = link.replace('@category@', `/${category}/`)
    } else {
      link = link.replace('@category@', '/')
    }

    let listNews = await controllerNews.getListNews(link)

    if (listNews) {
      list = remove ? listNews.listManga : list.concat(listNews.listManga)
      let source = this.dataSource.cloneWithRows(list)
      this.setState({
        source,
        list,
        page
      })
      if (remove && this.listView) {
        this.listView.scrollTo({x: 0, y: 0, animated: true})
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.category !== nextProps.category) {
      this.category = nextProps.category
      this.getList(0, nextProps.category, nextProps.sort, true)
    }
  }

  renderItem (item) {
    return (
      <TouchableOpacity
         onPress={() => Actions.read({item})}
         style={{width: 132, height: 180, margin: 5}}
       >
        <Card
          title={item.title}
          image={{uri: item.image}}
          containerStyle={{width: 132, height: 180, overflow: 'hidden', margin: 5}}
        >
        </Card>
      </TouchableOpacity>
    )
  }

  render () {
    const { icons, selected, source } = this.state
    const { category, sort, onGetListview } = this.props

    return (
      <ListView
        style={{backgroundColor: 'transparent', margin: 10, height: '100%'}}
        dataSource={source}
        ref={listView => {
          onGetListview(listView)
          this.listView = listView
        }}
        renderRow={(item, index) => this.renderItem(item, index)}
        pageSize={30}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'stretch'
        }}
        onEndReached={async e => {
          const { list, page } = this.state
          if (!this.searchText) {
            let next = page + 1
            await this.getList(next, category, sort, false, list)
          }
        }}
      />
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
