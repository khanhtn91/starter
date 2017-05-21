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
import { Card, ListItem, List, Button, SideMenu } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'
import TabBar from '../common/components/TabBar'

import { controllerNews } from '../common/utils/controller'

export default class Category extends Component {
  constructor (props) {
    super(props)
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.listView = null
    this.searchText = ''
    this.state = {
      source: null,
      list: [],
      page: 1,
      category: 'All',
      sort: 1,
      isOpen: false,
      size: null,
      categories: []
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
        categories: listNews.listTypes,
        category,
        page,
        sort
      })
      this.searchText = ''
      if (remove && this.listView) {
        this.listView.scrollTo({x: 0, y: 0, animated: true})
      }
    }
  } 

  componentDidMount () {
    const { page, sort, category } = this.state
    this.getList(page, category, sort, true)
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

  renderMenu (categories) {
    return (
      <View style={{backgroundColor: '#ededed', paddingTop: 10, flex: 1}}>
        {categories && (
          <ScrollView style={{marginBottom: 40, flex: 1}}>
            {
              categories.map((item, i) => (
                <ListItem
                  key={Math.random()}
                  onPress={async () => {
                    const { page, sort } = this.state
                    await this.getList(page, item.title , sort, true)
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
        const { page, category, sort } = this.state
          if (!this.searchText) {
            this.getList(page, category, sort, true)
          }
      break
      case 'menu':
      const { isOpen } = this.state
        this.setState({
          isOpen: !isOpen
        })
      break
      case 'back':
      console.log(Actions)
        Actions.root({type: ActionConst.RESET})
      break
    } 
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  async searchManga () {
    let search = this.searchText
    link = `http://hamtruyen.vn/${search}/tim-kiem.html`
    let listNews = await controllerNews.getListNews(link)

    if (listNews) {
      let source = this.dataSource.cloneWithRows(listNews.listManga)
      this.setState({
        source,
        list: listNews.listManga
      })
      if (this.listView) {
        this.listView.scrollTo({x: 0, y: 0, animated: true})
      }
    }
  }

  render () {
    const { source, isOpen, size, categories } = this.state

    return (
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
          <Row size={0} style={{overflow: 'hidden'}}>
            <Card
              containerStyle={{flex: 1, height: '100%', margin: 5, padding: 0, overflow: 'hidden'}}
            >
              <View style={{width: '100%', height: '100%', flexDirection: 'row'}}>
                <View style={{flex: 1, height: '100%', padding: 5}}>
                  <TextInput
                    placeholder={'Search text'} 
                    onChange={(event) => {
                      this.searchText = event.nativeEvent.text
                    }} 
                  />
                </View>
                <View style={{width: 80, height: '100%', padding: 1}}>
                  <Button
                    icon={{name: 'search'}}
                    onPress={() => this.searchManga()}
                  />
                </View>
              </View>
            </Card>
          </Row>
          <Row size={94}>
            {source && (
              <ListView
                style={{backgroundColor: 'transparent', margin: 10, height: '100%'}}
                dataSource={source}
                ref={listView => this.listView = listView}
                renderRow={(item, index) => this.renderItem(item, index)}
                pageSize={30}
                contentContainerStyle={{
                  flexDirection: 'row', 
                  flexWrap: 'wrap', 
                  justifyContent: 'space-around',
                  alignItems: 'stretch'
                }}
                onEndReached={async e => {
                  const { list, page, category, sort } = this.state
                  if (!this.searchText) {
                    let next = page + 1
                    await this.getList(next, category, sort, false, list)
                  }
                }}
              />
            )}
          </Row>
          <Row style={{height: 60}}>
            <TabBar selected={1} Actions={Actions}/>
          </Row>
        </Grid>
      </Image>
    </SideMenu>
    )
  }
}