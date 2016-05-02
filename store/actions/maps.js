import mongoose from 'mongoose'
import { spawnPlayerObject } from '../../packets/handlers/helpers'

export const ENTER_MAP = 'ENTER_MAP'
export const LEFT_MAP = 'LEFT_MAP'
export const INITIALIZE_MAP = 'INITIALIZE_MAP'

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
        .catch(console.log)
    } else {
      dispatch({
        type: ENTER_MAP,
        key: client.server.key,
        map: client.character.map,
        client
      })
      dispatch(showMapObjects(client))
    }
  }
}

function showMapObjects(client) {
  return (dispatch, getState) => {
    let mapData = getState().maps[client.server.key][client.character.map]
    return Promise.map(mapData.clients, other => {
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

function getInitialMapData(map) {
  return new Promise((resolve, reject) => {
    let mapData = {
      monsters: [],
      clients: [],
      npcs: []
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
                  return Promise.resolve(mapData)
                 })
      .then(resolve)
      .catch(reject)
  })
}
