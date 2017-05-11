import React from 'react'
import { connect, Provider } from 'react-redux'
import { BackAndroid } from 'react-native'
import { Scene, Router, Actions } from 'react-native-router-flux'
import { initStore } from './common/store'
import Home from './pages/Home'

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
            <Scene key='home' component={Home} initial hideNavBar />
          </Scene>
        </RouterWithRedux>
      </Provider>
    )
  }
}

export default App
