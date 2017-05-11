import axios from 'axios'
import { createAction } from 'redux-actions'

const actionQueue = []
function consumeActionQueue () {
  let action
  while ((action = actionQueue.pop()) != null) {
    action()
  }
}

export const fetchStart = createAction('api_fetchStart')
export const fetchSuccess = createAction('api_fetchSuccess')
export const fetchFailure = createAction('api_fetchFailure')

export const fetchApi = (dispatch, config) => {
  dispatch(fetchStart({ config }))
  return axios(config)
  .then(response => {
    actionQueue.push(() => dispatch(fetchSuccess({ response, config })))
    setTimeout(consumeActionQueue, 10)

    if (response.headers && response.headers['x-pagination-current-page']) {
      response.pagination = {
        current: Number(response.headers['x-pagination-current-page']),
        pages: Number(response.headers['x-pagination-page-count']),
        limit: Number(response.headers['x-pagination-per-page']),
        total: Number(response.headers['x-pagination-total-count'])
      }
    }
    return response
  })
  .catch(error => {
    if (error.response &&
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.errors
    ) {
      const _errors = {}
      error.response.data.errors.forEach(({ field, message }) => {
        _errors[field] = message
      })
      error.errors = _errors
    } else {
      error.errors = {}
    }

    if (error.response && error.response.data && error.response.data.message) {
      error.message = error.response.data.message
    }

    setTimeout(() => dispatch(fetchFailure({ error, config })), 200)
  })
}
