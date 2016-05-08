import PacketBuilder from '../../builder'
import { NUM_WORLDS, NUM_CHANNELS } from '../../../config'
import mongoose from 'mongoose'
import { addCharEntry } from '../helpers'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x05] = function(client, reader) {
    let world = reader.readByte()
    let channel = reader.readByte() + 1
    client.world = world
    client.channel = channel

    let packet = new PacketBuilder(0x0B)
    packet.write(0)
    mongoose.model('Character').find({account: client.account})
      .then(characters => {
        packet.write(characters.length)
        return mongoose.model('Item').find()
          .where('character').in(characters.map(c => c._id))
          .where('position').lt(0)
          .select('character position item')
          .then(items => {
            characters.forEach(char => {
              addCharEntry(packet, char, items.filter(item => char._id === item.character))
            })
            packet.writeInt(3) // max characters
            return client.sendPacket(packet)
          })
      }).catch(err => {
        console.log(err, err.stack)
      })
  }
}
