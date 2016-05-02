import PacketBuilder from '../../builder'
import mongoose from 'mongoose'
import { enterMap, leftMap } from '../../../store/actions/maps'
import {
  addCharacterToMap,
  removeCharacterFromMap
} from '../helpers'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x23] = function(client, reader, dispatch) {
    let count = reader.readByte()
    let opCode = reader.readInt()
    let portalName = reader.readString()
    let packet
    switch (opCode) {
      case -1: {
        mongoose.model('MapPortal').findOne({
          map: client.character.map,
          label: portalName
        }).then(portal => {
          if (!portal)
            return console.log(`Can't find portal on map ${client.character.map} and label ${portalName}`)
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
          console.log(err, err.stack)
        })
        break
      }
      default:
        console.log('Changing map, opcode is', opCode)
    }
  }
}
