import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  ScrollView
} from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Actions, ActionConst } from 'react-native-router-flux'
import styles from '../common/styles/Page'
import { Card, ListItem, Button } from 'react-native-elements'
import Swipeout from 'react-native-swipeout'

import { controllerNews } from '../common/utils/controller'
import Storage from '../common/utils/storage'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      information: null
    }
  }

  async componentDidMount () {
    const { item } = this.props
    try {
      let information = await controllerNews.getInformation(item)
      information = Object.assign(information, item)
      this.setState({
        information
      })
    } catch (e) {
      console.log(e)
    }
  }

  componentWillUpdate () {
    LayoutAnimation.spring()
  }

  renderChap (item, index, information) {
    item = Object.assign(item, {information})
    let btns = [
      {
        text: 'Save',
        onPress: () => { console.log(item) },
        type: 'primary',
      },
      {
        text: 'Books',
        onPress: () => { console.log(item) },
        type: 'secondary',
      }
    ]
    return (
      <Swipeout
        rowID={index}
        right={btns}
        backgroundColor={'#ffffff'}
        autoClose={true}
      >
        <TouchableOpacity
          key={index}
          onPress={() => {Actions.open({item, type: ActionConst.REPLACE})}}
          style={{
            backgroundColor: 'transparent',
            flexDirection: 'row',
            height: 40,
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            paddingLeft: 5,
            paddingRight: 5
          }}
        >
          <Text style={{flex: 2}}>
            {item.title}
          </Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text>
              {item.date}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeout>
    )
  }

  renderChaps (information) {
    let source = this.dataSource.cloneWithRows(information.chaps)

    return (
      <ListView
        style={{backgroundColor: 'transparent', width: '100%', height: '80%'}}
        dataSource={source}
        horizontal={false}
        renderRow={(item, index) => this.renderChap(item, index, information)}
      />
    )
  }

  readNow (information) {
    let item = information.chaps.pop()
    item = Object.assign(item, {information})
    Actions.open({item, type: ActionConst.REPLACE})
  }

  async addBookmark(information) {
    let item = this.props.item
    await Storage.savebookmark(item)
  }


  render () {
    const { item } = this.props
    const { information } = this.state
    return (
      <Image
        style={styles.baseContainer}
        resizeMode={'cover'}
        source={require('../assets/images/background.jpg')}
      >
        <controllerNews.ProgressBar/>
        <Grid style={{marginTop: 15}}>
          <Row size={65}>
            <Card
              containerStyle={{flex: 1}}
              wrapperStyle={{flex: 1, margin: 0, padding: 0}}
              title={item.title}
            >
              <View style={{width: '100%', height: '100%', flexDirection: 'column', flex: 1}}>
                <View style={{flex: 3}}>
                  <Image
                    resizeMode={'cover'}
                    source={{uri: item.image}}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                <View style={{flex: 4}}>
                {information && (
                  <ScrollView style={{height: '100%', width: '100%', marginBottom: 10}}>
                    <Text style={{marginBottom: 0, fontWeight: '500'}}>
                      {information.category}
                    </Text>
                    <Text style={{marginBottom: 0}}>
                      {information.summary}
                    </Text>
                  </ScrollView>
                )}
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Button
                    onPress={() => this.readNow(information)}
                    icon={{name: 'code'}}
                    backgroundColor='#03A9F4'
                    fontFamily='Lato'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    style={{width: '50%'}}
                    title='READ NOW' />
                  <Button
                    onPress={() => this.addBookmark(information)}
                    icon={{name: 'code'}}
                    backgroundColor='#fd9427'
                    fontFamily='Lato'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    style={{width: '50%'}}
                    title='BOOKMARKS' />
                </View>
              </View>
            </Card>
          </Row>
          <Row size={35}>
            <Card
              containerStyle={{flexDirection: 'column', flex: 1, marginBottom: 10}}
              title='LIST CHAPTER'>
              {information && (this.renderChaps(information))}
            </Card>
          </Row>
        </Grid>
	    </Image>
    )
  }
}
