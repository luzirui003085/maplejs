import PacketBuilder from '../../builder'
import { moveItemPacket, updateCharLook, broadcastMap } from '../helpers'
import mongoose from 'mongoose'
import { dropItem } from '../../../store/actions/maps'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x42] = function(client, reader, dispatch) {
    reader.skip(4)
    const type = reader.readByte()
    const src = reader.readShort()
    const dst = reader.readShort()
    let sourceItem = client.character.items.find(i => i.position === src)
    let targetItem = client.character.items.find(i => i.position === dst)
    let savepromises = []
    if (!!sourceItem) {
      sourceItem.position = dst
      savepromises.push(sourceItem.save())
    }
    if (!!targetItem) {
      targetItem.position = src
      savepromises.push(targetItem.save())
    }
    let quantity = reader.readShort()
    if (src < 0 && dst > 0) {
      client.sendPacket(moveItemPacket(type, src, dst, 1))
        .then(() => Promise.all(savepromises))
        .then(() => broadcastMap(client, updateCharLook(client.character), false))
        .catch(console.log)
    } else if (dst < 0) {
      client.sendPacket(moveItemPacket(type, src, dst, 2))
        .then(() => Promise.all(savepromises))
        .then(() => broadcastMap(client, updateCharLook(client.character), false))
        .catch(console.log)
    } else if (dst === 0) {
      client.character.items = client.character.items.filter(i => i.position !== 0)
      if (src < 0) {
        Promise.all(savepromises)
          .then(() => broadcastMap(client, updateCharLook(client.character), false))
          .catch(console.log)
      }

      dispatch(dropItem(client, sourceItem))
      // let packet = new PacketBuilder(0x1A)
      // packet.writeArray([0x01, 0x01, 0x03])
      // packet.write(type)
      // packet.writeShort(src)
      // if (src < 0)
      //   packet.write(1)
      // client.sendPacket(packet)
    } else {
      client.sendPacket(moveItemPacket(type, src, dst, -1))
    }
  }
}
