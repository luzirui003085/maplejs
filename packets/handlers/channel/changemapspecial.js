import PacketBuilder from '../../builder'
import mongoose from 'mongoose'
import { enterMap, leftMap } from '../../../store/actions/maps'
import {
  addCharacterToMap,
  removeCharacterFromMap,
  enableActions
} from '../helpers'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x5c] = function(client, reader, dispatch) {
    reader.skip(1)
    let portalLabel = reader.readString()
    reader.skip(2)
    let packet
    mongoose.model('MapPortal').findOne({
      map: client.character.map,
      label: portalLabel
    }).then(portal => {
      if (!portal) {
        throw new Error("Can't find portal on map")
      }
      packet = new PacketBuilder(0x5C)
      packet.writeInt(client.server.channel - 1)
      packet.writeShort(0x2)
      packet.writeShort(0)
      removeCharacterFromMap(client)
      dispatch(leftMap(client.server.key, client.character.map, client))
      packet.writeInt(portal.destination)
      return mongoose.model('MapPortal').findOne({
        map: portal.destination,
        label: portal.destinationLabel
      })
    }).then(portal => {
      if (!portal) {
        throw new Error("Can't find destination portal")
      }
      packet.write(portal.id)
      packet.writeShort(client.character.hp)
      packet.write(0)
      packet.writeLong(0x1ffffffffffffff) // wtf, questmask!?!?
      client.character.map = portal.map
      client.character.save()
      return client.sendPacket(packet)
    }).then(() => dispatch(enterMap(client)))
    .then(() => addCharacterToMap(client))
    .catch(err => {
      console.log(err.stack)
      client.sendPacket(enableActions())
    })
  }
}
