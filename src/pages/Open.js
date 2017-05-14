import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ListView,
  Picker,
  LayoutAnimation
} from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Actions } from 'react-native-router-flux'
import styles from '../common/styles/Page'
import { Card, ListItem, Button } from 'react-native-elements'
import FitImage from 'react-native-fit-image'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'
import ImageViewer from 'react-native-image-zoom-viewer'

import { controllerNews } from '../common/utils/controller'

export default class Open extends Component {
  constructor (props) {
    super(props)
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.listView = null
    this.state = {
      chaps: props.item.information.chaps,
      pages: [],
      flip: false, 
      current: ''
    }
    console.log(props)
  }

  async componentDidMount () {
    const { item } = this.props
    let manga = await controllerNews.getManga(item)
    console.log(manga)
    this.setState({
      chaps: manga.chaps,  
      pages: manga.pages,
      current: item.url
    })
  }

  async _onValueChange (value) {
    const { current, chaps } = this.state
    let { item } = this.props

    if (value && current != value) {
      item.url = value

      let manga = await controllerNews.getManga(item)
      this.setState({
        chaps: manga.chaps,  
        pages: manga.pages,
        current: value
      })
    }
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  renderPages (pages) {
    let source = this.dataSource.cloneWithRows(pages)

    return (
      <ListView
        ref={(listView) => this.listView = listView}
        style={{backgroundColor: 'transparent', width: '100%', height: '100%'}}
        dataSource={source}
        horizontal={false}
        enableEmptySections={true}
        renderRow={(item, index) => (
          <View style={{flexDirection: 'row'}}>
            <FitImage 
              resizeMode={'stretch'}
              source={{uri: item.image}}
            />
          </View>
        )}
      />
    )
  }

  _controlPress (action, params = {}) {
    switch (action) {
      case 'up':
        if (this.listView)
          this.listView.scrollTo({x: 0, y: 0, animated: true})
      break
      case 'view':
        const { flip } = this.state
        this.setState({
          flip: !flip
        })
      break
      case 'back':
        Actions.pop()
      break
    } 
  }

  render () {
    const { pages, chaps, current, flip } = this.state
    const { item } = this.props

    let images = null
    if (flip && pages.length) {
      images = pages.map(item => ({url: item.image}))
    }

    return (
      <Image 
        style={styles.baseContainer} 
        resizeMode={'cover'} 
        source={require('../assets/images/background.jpg')}
      >
      <Grid>
        <Row size={5}>
          <Card
            containerStyle={{flexDirection: 'row', flex: 1, height: '85%', margin: 5, padding: 0}}
          >
            <Picker
              style={{flex: 1}}
              onValueChange={(value ) => this._onValueChange(value)}
              selectedValue={current}
              mode="dialog">
              {chaps && chaps.map((chap) => (<Picker.Item key={Math.random()} label={`${chap.title}`} value={`${chap.url}`} />))}
            </Picker>
          </Card>
        </Row>
          {!flip ? (
            <Row size={95}>
              <Card
                title={item.title}
                containerStyle={{flexDirection: 'column', flex: 1, height: '99%', margin: 5, padding: 0}}
              >
                {pages && (
                  this.renderPages(pages)
                )}
              </Card>
            </Row>
          ) : (
            <Row size={95}>
              {images && 
                (<ImageViewer 
                  style={{
                    backgroundColor: 'transparent',
                    flex: 1,
                    marginTop: 5
                  }} 
                  imageUrls={images}
                  renderArrowLeft={() => (
                    <View style={{width: 50, height: 50, zIndex: 99, marginLeft: 10}}>
                      <Icon name='ios-arrow-back-outline' color='#ffffff' size={50} />
                    </View>
                  )}
                  renderArrowRight={() => (
                    <View style={{width: 50, height: 50,  zIndex: 99, marginRight: 10}}>
                      <Icon name='ios-arrow-forward-outline' color='#ffffff' size={50} />
                    </View>
                  )}
              />)}
            </Row>
          )}
          <View style={styles.actionButton}>
            <ActionButton buttonColor="rgba(231,76,60,1)" autoInactive={false}>
              <ActionButton.Item buttonColor='#9b59b6' title="GO TO TOP" onPress={() => this._controlPress('up')}>
                <Icon name="md-arrow-dropup" size={20} color='#ffffff' />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='#3498db' title="SWIPE MODE" onPress={() => this._controlPress('view')}>
                <Icon name="md-albums" size={20} color='#ffffff' />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='#1abc9c' title="BACK" onPress={() => this._controlPress('back')}>
                <Icon name="md-arrow-back" size={20} color='#ffffff' />
              </ActionButton.Item>
            </ActionButton>
          </View>
        </Grid>
	    </Image>
    )
  }
}