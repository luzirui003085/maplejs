import mongoose from 'mongoose'
import {
  spawnPlayerObject, spawnItemDropPacket,
  addInventoryItem, removeItemFromMap,
  enableActions
} from '../../packets/handlers/helpers'

export const NEUTRAL_START_ID = 500

export const ENTER_MAP = 'ENTER_MAP'
export const LEFT_MAP = 'LEFT_MAP'
export const INITIALIZE_MAP = 'INITIALIZE_MAP'
export const ADD_ITEM = 'ADD_ITEM'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const REMOVE_MONSTER = 'REMOVE_MONSTER'

export function enterMap(client) {
  return (dispatch, getState) => {
    if (!getState().maps[client.server.key][client.character.map]) {
      return getInitialMapData(client.character.map)
        .then(mapData => dispatch(initializeMap(client.server.key, client.character.map, mapData)))
        .then(() => dispatch({
            type: ENTER_MAP,
            key: client.server.key,
            map: client.character.map,
            client
          })).then(() => dispatch(showMapObjects(client)))
        .catch(err => {
          console.log(err.stack)
        })
    } else {
      dispatch({
        type: ENTER_MAP,
        key: client.server.key,
        map: client.character.map,
        client
      })
      return dispatch(showMapObjects(client)).catch(err => console.log(err.stack))
    }
  }
}

function showMapObjects(client) {
  return (dispatch, getState) => {
    let mapData = getState().maps[client.server.key][client.character.map]
    return Promise.map(mapData.clients.filter(o => o !== client), other => {
      return client.sendPacket(spawnPlayerObject(other.character))
        .then(() => other.sendPacket(spawnPlayerObject(client.character)))
    }).then(() => {
      return Promise.map(mapData.npcs, npc => {
        return client.sendPacket(npc.createSpawnPacket())
          .then(() => {
            return client.sendPacket(npc.createControlPacket())
          })
      })
    }).then(() => {
      return Promise.map(mapData.monsters, monster => {
        return client.sendPacket(monster.createSpawnPacket())
          .then(() => {
            return client.sendPacket(monster.createControlPacket())
          })
      })
    }).then(() => {
      return Promise.map([...mapData.neutrals], ([position, item]) => {
        return client.sendPacket(spawnItemDropPacket(item,
                                                     NEUTRAL_START_ID + position,
                                                     item.location, false, 0, 2, 0))
      })
    })
  }
}

function initializeMap(key, map, data) {
  return {
    type: INITIALIZE_MAP,
    key,
    map,
    data
  }
}

export function leftMap(key, map, client) {
  return {
    type: LEFT_MAP,
    key,
    map,
    client
  }
}

export function addItem(key, map, item) {
  return {
    type: ADD_ITEM,
    key,
    map,
    item
  }
}

function removeMonster(key, map, monsterId) {
  return {
    type: REMOVE_MONSTER,
    key,
    map,
    monsterId
  }
}

export function killMonster(client, monster) {
  return (dispatch, getState) => {
    dispatch(removeMonster(client.server.key, client.character.map, monster.id))
    client.sendPacket(monster.getKilledPacket())
  }
}

export function dropItem(client, item) {
  return (dispatch, getState) => {
    dispatch(addItem(client.server.key, client.character.map, item))
    let mapData = getState().maps[client.server.key][client.character.map]
    let itemMapId = NEUTRAL_START_ID
    for (var [key, mapItem] of mapData.neutrals) {
      if (mapItem._id === item._id) {
        itemMapId += key
        break
      }
    }
    return Promise.map(mapData.clients, other => {
      other.sendPacket(spawnItemDropPacket(item, itemMapId, item.location))
    })
  }
}

export function removeItem(key, map, itemMapId) {
  return {
    type: REMOVE_ITEM,
    key,
    map,
    itemMapId
  }
}

export function lootItem(client, itemMapId) {
  return (dispatch, getState) => {
    let mapData = getState().maps[client.server.key][client.character.map]
    let item = mapData.neutrals.get(itemMapId - NEUTRAL_START_ID)
    if (!item) {
      console.log('No item to loot', item, mapData.neutrals)
      return
    }
    dispatch(removeItem(client.server.key, client.character.map, itemMapId - NEUTRAL_START_ID))
    let position = 1
    for (let i = 1; i <= client.character.equipSlots; i++) {
      if (!client.character.items.has(i)) {
        position = i
        break
      }
    }
    item.position = position
    item.character = client.character
    item.save()
      .then(() => {
        client.character.items.set(item.position, item)
        return Promise.map(mapData.clients, other => {
          return other.sendPacket(removeItemFromMap(itemMapId, 2, client.character._id))
        })
      }).then(() => {
        return client.sendPacket(addInventoryItem(item))
      }).then(() => {
        return client.sendPacket(enableActions())
      }).catch(err => console.log(err.stack))
  }
}

function getInitialMapData(map) {
  return new Promise((resolve, reject) => {
    let mapData = {
      monsters: [],
      clients: [],
      npcs: [],
      neutrals: new Map()
    }
    Promise.join(mongoose.model('Monster').getMonstersOnMap(map),
                 mongoose.model('Npc').getNpcsOnMap(map),
                 (monsters, npcs) => {
                  monsters.forEach(monster => {
                    mapData.monsters.push(monster)
                  })
                  npcs.forEach(npc => {
                    mapData.npcs.push(npc)
                  })
                  resolve(mapData)
                 })
      .catch(reject)
  })
}
