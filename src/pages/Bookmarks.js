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
import Storage from '../common/utils/storage'

import { controllerNews } from '../common/utils/controller'

export default class Bookmarks extends Component {
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
    let listNews = await Storage.bookmarks()
    
    if (listNews) {
      console.log(list)
      let source = this.dataSource.cloneWithRows(listNews)
      this.setState({
        source,
        listNews,
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

        <Image
          style={{width: 132, height: 180}}
          resizeMode={'cover'}
          source={{uri: item.image}}
        >
          <View style={
            {
              backgroundColor: 'rgba(0,0,0,0.8)',
              position:'absolute',
              bottom:0,
              width:'100%'
            }
          }>
            <Text style={{padding: 5, color: 'white'}}>
              {item.title}
            </Text>
          </View>
        </Image>
      </TouchableOpacity>
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

  render () {
    const { source, size } = this.state
    return (
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
          <controllerNews.ProgressBar/>
        <Grid style={{backgroundColor: 'transparent', width: '100%'}}>
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
            <TabBar selected={3} Actions={Actions}/>
          </Row>
        </Grid>
      </Image>
    )
  }
}