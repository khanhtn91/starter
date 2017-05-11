import { handleActions } from 'redux-actions'
import { fetchStart, fetchSuccess, fetchFailure } from './api'

const updateFetching = (fetching, payload, upDown) => {
  const { config } = payload
  const key = config.key || config.url
  return {...fetching, ...{[key]: (fetching[key] || 0) + upDown}}
}

const defaultState = {
  fetching: {}
}

const handlers = {
  [fetchStart]: (state, action) => ({
    ...state,
    ...{ fetching: updateFetching(state.fetching, action.payload, 1) }
  }),
  [fetchSuccess]: (state, action) => ({
    ...state,
    ...{ fetching: updateFetching(state.fetching, action.payload, -1) }
  }),
  [fetchFailure]: (state, action) => ({
    ...state,
    ...{ fetching: updateFetching(state.fetching, action.payload, -1) }
  })
}

export default handleActions(handlers, defaultState)
