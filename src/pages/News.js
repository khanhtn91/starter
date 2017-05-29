import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Actions } from 'react-native-router-flux'
import styles from '../common/styles/Page'
import { Card, ListItem, Button } from 'react-native-elements'
import Swiper from 'react-native-deck-swiper'
import TabBar from '../common/components/TabBar'

import { controllerNews } from '../common/utils/controller'

export default class News extends Component {
  constructor (props) {
    super(props)
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      source: null,
      hots: null,
      page: 1,
      size: null,
      list: []
    }
  }

  async getList (page, list = []) {
    let listNews = await controllerNews.getListNews(`http://hamtruyen.vn/danhsach/P${page}/index.html?sort=2`)

    if (listNews) {
      list = list.concat(listNews.listManga)
      let source = this.dataSource.cloneWithRows(list)
      this.setState({
        source,
        list
      })
    }
  }

  async getHotList () {
    let hots = await controllerNews.getListHot()
    if (hots) {
      this.setState({
        hots
      })
    }
  }

  componentDidMount () {
    const { page } = this.state
    this.getList(page)
    this.getHotList()
  }

  renderItem (item) {
    return (
      <TouchableOpacity
        onPress={() => Actions.read({item})}
        style={{width: 180, height: 225, margin: 5, marginBottom: 80}}
      >
        <Image
          style={{width: 180, height: 225}}
          resizeMode={'cover'}
          source={{uri: item.image}}
        >
        <View style={
          {
            backgroundColor: 'transparent',
            flex: 1,
            width: 180
          }
        }>
        </View>
        <View style={
          {
            backgroundColor: 'black',
            opacity: 0.8,
            width: 180
          }
        }>
          <Text style={{padding: 10, color: 'white'}}>
            {item.title}
          </Text>
        </View>

        </Image>
      </TouchableOpacity>
    )
  }

  renderListNews (source) {

    return (
      <ListView
        style={{backgroundColor: 'transparent', flex: 1}}
        dataSource={source}
        horizontal={true}
        renderRow={(item) => this.renderItem(item)}
        contentContainerStyle={{}}
        onEndReached={async e => {
          const { list, page } = this.state
          let next = page + 1
          await this.getList(next, list)
        }}
      />
    )
  }

  renderHotItem (item) {
    return (
      <View style={styles.card}>
        <View style={{flex: 2}}>
          <Image
            style={{flex: 1}}
            resizeMode='contain'
            source={{uri: item.image}}
          />
        </View>
        <View style={{flex: 2, padding: 20, paddingTop: 40}} >
          <Text style={{fontSize: 16, fontWeight: '500'}} onPress={() => Actions.read({item})}>{item.title}</Text>
          <Text>{item.chap}</Text>
        </View>
      </View>
    )
  }

  componentWillUpdate () {
    LayoutAnimation.spring()
  }

  render () {
    const { source, hots, size } = this.state
    return (
      <Image
        style={styles.baseContainer}
        resizeMode={'cover'}
        source={require('../assets/images/background.jpg')}
      >
        <controllerNews.ProgressBar/>
        <Grid>
          <Row
            onLayout={size => {
              this.setState({size: size.nativeEvent})
            }}
            style={{backgroundColor: 'transparent'}}
          >
            {(hots && size) && (
              <Swiper
                cards={hots}
                renderCard={(card) => this.renderHotItem(card)}
                infinite={true}
                onSwiped={(cardIndex) => {console.log(cardIndex)}}
                onSwipedAll={() => {console.log('onSwipedAll')}}
                cardIndex={0}
                backgroundColor={'transparent'}
                marginBottom={250}
                cardWidth={size.layout.width - 40}
                cardHeight={size.layout.height - 70}
              />
            )}
          </Row>
          <Row style={{height: 250}}>
            {source && this.renderListNews(source)}
          </Row>
          <Row style={{height: 60}}>
            <TabBar selected={2} Actions={Actions} />
          </Row>
        </Grid>
      </Image>
    )
  }
}
