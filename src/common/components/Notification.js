import { MessageBarManager } from 'react-native-message-bar'

const Notification = {
  display: (notification) => {
    const alert = Object.assign(
      {},
      notification,
      {
        animationType: 'SlideFromRight',
        duration: 5000
      }
    )
    MessageBarManager.showAlert(alert)
  },

  displayWithDelay: (notification) => {
    setTimeout(() => {
      Notification.display(notification)
    }, 100)
  },

  success: (message) => {
    Notification.displayWithDelay({ message, alertType: 'success' })
  },

  info: (message) => {
    Notification.displayWithDelay({ message, alertType: 'info' })
  },

  warning: (message) => {
    Notification.displayWithDelay({ message, alertType: 'warning' })
  },

  error: (message) => {
    Notification.displayWithDelay({ message, alertType: 'error' })
  }
}

export default Notification
