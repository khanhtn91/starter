import { takeEvery } from 'redux-saga/effects'
import Notification from './components/Notification'
import { fetchStart, fetchSuccess, fetchFailure } from './api'

function * onFetchStart ({ payload: { config } }) {
  console.log('Fetch Start')
}

function * onFetchSuccess ({ payload: { response, config } }) {
  console.log('Fetch Success')
}

function * onFetchFailure ({ payload: { error, config } }) {
  Notification.error(error.message)
}

function * watchFetchStart () {
  yield takeEvery(fetchStart.toString(), onFetchStart)
}
function * watchFetchSuccess () {
  yield takeEvery(fetchSuccess.toString(), onFetchSuccess)
}
function * watchFetchFailure () {
  yield takeEvery(fetchFailure.toString(), onFetchFailure)
}

export default (getState) => {
  function * rootSaga () {
    yield [
      watchFetchStart(),
      watchFetchSuccess(),
      watchFetchFailure()
    ]
  }
  return rootSaga
}
