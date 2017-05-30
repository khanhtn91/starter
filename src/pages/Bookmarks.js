import React, { Component } from 'react'
import {
  View,
  Text,
  ListView,
  Image,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native'
import { Row, Grid } from 'react-native-easy-grid'
import { Actions } from 'react-native-router-flux'
import styles from '../common/styles/Page'
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
    }
  }

  async getList (page, category, sort, remove = false, list = []) {
    let listNews = await Storage.bookmarks()
    if (listNews) {
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
         onLongPress ={async (e)=>{
          await this.removeBookmark(item)
         }}
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


  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  async removeBookmark(girl) {
    await Storage.removebookmark(girl);
    let listNews = await Storage.bookmarks()
    let source = this.dataSource.cloneWithRows(listNews)
    this.setState({
      source,
    })
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
        <Grid style={{backgroundColor: 'transparent', width: '100%', marginTop:25}}>

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