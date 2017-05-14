import React from 'react'
import { connect, Provider } from 'react-redux'
import { BackAndroid, Text, View } from 'react-native'
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux'
import { initStore } from './common/store'
import IconButton from './common/components/IconButton'
import Category from './pages/Category'
import News from './pages/News'
import Read from './pages/Read'
import Open from './pages/Open'
import Icon from 'react-native-vector-icons/Ionicons'

const RouterWithRedux = connect()(Router)
const store = initStore()

class TabIcon extends React.Component {
  render () {
    const { title, selected, myIcon, sceneKey } = this.props
    return (
      <View 
        style={{
          justifyContent: 'space-around', 
          alignItems: 'center'
        }}
      >
        <Icon name={myIcon} size={20} color={selected ? 'red' :'black'} />
        {title && (
          <Text>{title}</Text>
        )}
      </View>
    )
  }
}

class App extends React.Component {
  componentWillMount = () => {
    BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop())
  }

  render () {
    return (
      <Provider store={store}>
        <RouterWithRedux duration={300} animation='fade'>
          <Scene key='root'>
            <Scene key="read" hideNavBar={true} component={Read}/>
            <Scene key="open" hideNavBar={true} component={Open}/>
            <Scene key="mainPage" initial tabs={true} tabBarStyle={{height: 60, backgroundColor: 'white'}}>
              <Scene key="category" 
                component={Category} 
                title="Category" 
                myIcon={'ios-albums-outline'} 
                hideNavBar={true} 
                hideTabBar={true}
                icon={TabIcon}
                type={ActionConst.RESET}
              />
              <Scene 
                key="news" 
                initial 
                component={News} 
                title="News" 
                myIcon={'ios-paper-plane-outline'} 
                hideNavBar={true} 
                icon={TabIcon}
                type={ActionConst.RESET}
              />
              <Scene 
                key="your" 
                component={News} 
                title="Your" 
                myIcon={'ios-person-outline'} 
                hideNavBar={true} 
                hideTabBar={true}
                icon={TabIcon}
                type={ActionConst.RESET}
              />
            </Scene>
          </Scene>
        </RouterWithRedux>
      </Provider>
    )
  }
}

export default App
