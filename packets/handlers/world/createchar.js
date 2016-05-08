import PacketBuilder from '../../builder'
import mongoose from 'mongoose'
import { addCharEntry } from '../helpers'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x16] = function(client, reader) {
    let name = reader.readString()
    let face = reader.readInt()
    let hair = reader.readInt()
    let hairColor = reader.readInt()
    let skinColor = reader.readInt()
    let top = reader.readInt()
    let bottom = reader.readInt()
    let shoes = reader.readInt()
    let weapon = reader.readInt()
    let gender = reader.readByte()
    let str = reader.readByte()
    let dex = reader.readByte()
    let int = reader.readByte()
    let luk = reader.readByte()
    mongoose.model('Character').create({
      account: client.account,
      world: client.world,
      face: face,
      hair: hair + hairColor,
      gender: gender,
      str: 4,
      dex: 4,
      int: 4,
      luk: 4,
      ap: 9,
      name: name,
      skinColor: skinColor
    }).then(char => {
      let promises = []
      promises.push(mongoose.model('Item').createItem(top, char._id, -5))
      promises.push(mongoose.model('Item').createItem(bottom, char._id, -6))
      promises.push(mongoose.model('Item').createItem(shoes, char._id, -7))
      promises.push(mongoose.model('Item').createItem(weapon, char._id, -11))
      Promise.all(promises)
        .then(equips => {
          let packet = new PacketBuilder(0x0E)
          packet.write(0)
          addCharEntry(packet, char, equips)
          return client.sendPacket(packet)
        })
    }).catch(console.log)
  }
}
