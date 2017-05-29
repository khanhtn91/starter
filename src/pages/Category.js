import React, { Component } from 'react'
import {
  View,
  Text,
  ListView,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
  TextInput
} from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Actions, ActionConst } from 'react-native-router-flux'
import styles from '../common/styles/Page'
import { Card, ListItem, List, SideMenu, Button } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'
import TabBar from '../common/components/TabBar'
import MangaList from '../modules/categories/components/MangaList'

import { controllerNews } from '../common/utils/controller'

export default class Category extends Component {
  constructor (props) {
    super(props)
    this.listView = null
    this.searchText = ''
    this.state = {
      category: 'All',
      sort: 1,
      isOpen: false,
      size: null,
      categories: [],
      list: null
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
      this.setState({
        categories: listNews.listTypes,
        list: listNews.listManga,
        category,
        sort,
      })
    }
  }

  onGetListview (ref) {
    this.listView = ref
  }

  componentDidMount () {
    const { sort, category } = this.state
    this.getList(1, category, sort, true)
  }

  renderMenu (categories) {
    return (
      <View style={{backgroundColor: '#ededed', paddingTop: 10, flex: 1}}>
        {categories && (
          <ScrollView style={{marginBottom: 60, flex: 1}}>
            {
              categories.map((item, i) => (
                <ListItem
                  key={Math.random()}
                  onPress={async () => {
                    const { sort } = this.state
                    await this.getList(1, item.title , sort, true)
                  }}
                  title={item.title}
                />
              ))
            }
          </ScrollView>
        )}
      </View>
    )
  }

  _controlPress (action, params = {}) {
    switch (action) {
      case 'up':
        if (this.listView)
          this.listView.scrollTo({x: 0, y: 0, animated: true})
      break
      case 'reload':
        const { category, sort } = this.state
          if (!this.searchText) {
            this.getList(1, category, sort, true)
          }
      break
      case 'menu':
      const { isOpen } = this.state
        this.setState({
          isOpen: !isOpen
        })
      break
      case 'back':
        Actions.root({type: ActionConst.RESET})
      break
    }
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  render () {
    const { isOpen, size, categories, category, sort, list } = this.state
    return (
      <View style={{flex: 1, backgroundColor: 'red'}}>
        <controllerNews.ProgressBar/>
        <SideMenu
          isOpen={isOpen}
          menu={this.renderMenu(categories)}
          edgeHitWidth={400}
          hiddenMenuOffset={50}
          openMenuOffset={150}
        >
          <Image
            style={styles.baseContainer}
            resizeMode={'cover'}
            source={require('../assets/images/background.jpg')}
            onLayout={e => {
              if (size && e.nativeEvent.layout.width != size.layout.width) {
                this.setState({size: e.nativeEvent})
              } else if (size == null) {
                this.setState({size: e.nativeEvent})
              }
            }}
          >
          <Grid style={{backgroundColor: 'transparent', width: size ? (size.layout.width - 50) : '100%'}}>
            <View style={[styles.actionButton, {bottom: 100}]}>
              <ActionButton buttonColor="rgba(231,76,60,1)" autoInactive={true}>
                <ActionButton.Item buttonColor='#3498db' title="MENU" onPress={() => this._controlPress('menu')}>
                  <Icon name="md-albums" size={20} color='#ffffff' />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#9b59b6' title="GO TO TOP" onPress={() => this._controlPress('up')}>
                  <Icon name="md-arrow-dropup" size={20} color='#ffffff' />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="RELOAD" onPress={() => this._controlPress('reload')}>
                  <Icon name="md-refresh" size={20} color='#ffffff' />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#1abc9c' title="BACK" onPress={() => this._controlPress('back')}>
                  <Icon name="md-arrow-back" size={20} color='#ffffff' />
                </ActionButton.Item>
              </ActionButton>
            </View>
            <Row>
              {list &&
                <MangaList
                  category={category}
                  sort={sort}
                  onGetListview={listView => this.onGetListview(listView)}
                  list={list}
                />
              }
            </Row>
            <Row style={{height: 60}}>
            </Row>
          </Grid>
        </Image>
      </SideMenu>
      <View style={{height: 60, position: 'absolute', bottom: 0, left: 0, width: '100%'}}>
        <TabBar selected={1} Actions={Actions}/>
      </View>
    </View>
    )
  }
}
