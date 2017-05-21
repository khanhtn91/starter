import React from 'react'
import { connect, Provider } from 'react-redux'
import { BackAndroid, Text, View } from 'react-native'
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux'
import { initStore } from './common/store'
import Category from './pages/Category'
import News from './pages/News'
import Read from './pages/Read'
import Open from './pages/Open'
import Icon from 'react-native-vector-icons/Ionicons'

const RouterWithRedux = connect()(Router)
const store = initStore()

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
            <Scene key="category" 
                component={Category} 
                hideNavBar={true} 
                type={ActionConst.RESET}
              />
              <Scene 
                key="news" 
                initial
                hideNavBar={true} 
                component={News}
                type={ActionConst.RESET}
              />
              <Scene 
                key="your" 
                hideNavBar={true}
                component={News} 
                title="Your" 
                type={ActionConst.RESET}
              />
          </Scene>
        </RouterWithRedux>
      </Provider>
    )
  }
}

export default App
