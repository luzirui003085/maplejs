import mongoose from 'mongoose'
import { spawnPlayerObject, spawnItemDropPacket } from '../../packets/handlers/helpers'

export const NEUTRAL_START_ID = 500

export const ENTER_MAP = 'ENTER_MAP'
export const LEFT_MAP = 'LEFT_MAP'
export const INITIALIZE_MAP = 'INITIALIZE_MAP'
export const ADD_ITEM = 'ADD_ITEM'

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

export function dropItem(client, item) {
  return (dispatch, getState) => {
    dispatch(addItem(client.server.key, client.character.map, item))
    let mapData = getState().maps[client.server.key][client.character.map]
    let itemMapId = mapData.neutrals.map(i => i._id).indexOf(item._id)
    return Promise.map(mapData.clients, other => {
      other.sendPacket(spawnItemDropPacket(item, itemMapId, client.character))
    })
  }
}

function getInitialMapData(map) {
  return new Promise((resolve, reject) => {
    let mapData = {
      monsters: [],
      clients: [],
      npcs: [],
      neutrals: []
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
