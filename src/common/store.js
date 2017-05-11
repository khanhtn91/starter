import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { reducer as formReducer } from 'redux-form'
import createSaga from './sideEffects'
import commonReducer from './reducers'
import routeReducer from './routeReducers'
import authenticationReducer from '../modules/authentication/reducers'
import homeReducer from '../modules/home/reducers'
import demoReducer from '../modules/demo/reducers'

const createMiddlewares = (sagaMiddleware) => {
  const middlewares = []
  if (sagaMiddleware) {
    middlewares.push(sagaMiddleware)
  }
  return applyMiddleware.apply({}, middlewares)
}

const createReducers = (reducers) => {
  return combineReducers({
    common: commonReducer,
    route: routeReducer,
    form: formReducer,
    authentication: authenticationReducer,
    home: homeReducer,
    demo: demoReducer,
    ...reducers
  })
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const buildStore = (reducers, initialState) => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    createReducers(reducers),
    initialState,
    composeEnhancers(
      createMiddlewares(sagaMiddleware)
    )
  )

  if (module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(createReducers(reducers))
    })
  }

  store.reducers = createReducers(reducers)
  sagaMiddleware.run(createSaga(store.getState))
  return store
}

export const initStore = (reducers, initialState = {}) => {
  const store = buildStore(reducers, initialState)
  return store
}
