import React from 'react'
import { View } from 'react-native'
import { MessageBar, MessageBarManager } from 'react-native-message-bar'

export default ({ Page }) => class DefaultPage extends React.Component {
  componentDidMount () {
    MessageBarManager.registerMessageBar(this.refs.notificationSystem)
  }

  componentWillUnmount () {
    MessageBarManager.unregisterMessageBar()
  }

  render () {
    return (
      <View>
        <Page {...this.props} />
        <MessageBar ref='notificationSystem' />
      </View>
    )
  }
}
