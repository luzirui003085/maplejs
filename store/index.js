import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

function logger({getState}) {
  return next => action => {
    let returnValue = next(action)
    // console.log('Action', action.type)
    return returnValue
  }
}

const store = createStore(
  reducers,
  applyMiddleware(thunk, logger)
)

store.getMap = client => {
  return store.getState().maps[client.server.key][client.character.map]
}

export default store
