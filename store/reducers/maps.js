import { INITIALIZE_MAP, ENTER_MAP, LEFT_MAP, ADD_ITEM, REMOVE_ITEM,
REMOVE_MONSTER } from '../actions/maps'
import { NUM_WORLDS, NUM_CHANNELS } from '../../config'

let initialState = {}
for (let world = 0; world < NUM_WORLDS; world++) {
  for (let channel = 1; channel <= NUM_CHANNELS; channel++) {
    initialState[`${world}_${channel}`] = {}
  }
}
export default function maps(state=initialState, action) {
  let subState = Object.assign({}, state[action.key])
  switch(action.type) {
    case INITIALIZE_MAP:
      subState[action.map] = action.data
      return Object.assign({}, state, {
        [action.key]: subState
      })
    case ENTER_MAP:
      subState[action.map].clients.push(action.client)
      return Object.assign({}, state, {
        [action.key]: subState
      })
    case LEFT_MAP:
      subState[action.map].clients = subState[action.map].clients.filter(c => c.character._id !== action.client.character._id)
      return Object.assign({}, state, {
        [action.key]: subState
      })
    case ADD_ITEM:
      let neutrals = subState[action.map].neutrals
      for (var i = 0; i < 100000; i++) {
        if (!neutrals.has(i)) {
          neutrals.set(i, action.item)
          break
        }
      }
      return Object.assign({}, state, {
        [action.key]: subState
      })
    case REMOVE_ITEM:
      subState[action.map].neutrals.delete(action.itemMapId)
      return Object.assign({}, state, {
        [action.key]: subState
      })
    case REMOVE_MONSTER:
      subState[action.map].monsters = subState[action.map].monsters.filter(m => m.id !== action.monsterId)
      return Object.assign({}, state, {
        [action.key]: subState
      })
    default:
      return state
  }
}
