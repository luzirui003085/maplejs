import { NUM_WORLDS, NUM_CHANNELS, AUTO_REGISTER } from '../../config'
import { CLIENT_CONNECTED, CLIENT_DISCONNECTED } from '../actions/clients'

let initialState = {}
for (let world = 0; world < NUM_WORLDS; world++) {
  for (let channel = 1; channel <= NUM_CHANNELS; channel++) {
    initialState[`${world}_${channel}`] = []
  }
}

initialState['-1_-1'] = []

export default function clients(state=initialState, action) {
  let newState
  switch(action.type) {
    case CLIENT_CONNECTED:
      newState = Object.assign({}, state)
      if (!newState[action.key])
        newState[action.key] = [action.client]
      else
        newState[action.key].push(action.client)
      return newState
    case CLIENT_DISCONNECTED:
      newState = Object.assign({}, state)
      newState[action.key].pop(action.client)
      return newState
    default:
      return state
  }
}
