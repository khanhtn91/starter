import { handleActions } from 'redux-actions'

const defaultState = {
  scene: {}
}

const handlers = {
  // Constants from react-native-router-flux
  focus: (state, action) => ({
    ...state,
    ...{ scene: action.scene }
  })
}

export default handleActions(handlers, defaultState)
