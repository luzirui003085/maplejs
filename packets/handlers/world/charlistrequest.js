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
        characters.forEach(char => {
          addCharEntry(packet, char)
        })
        packet.writeInt(3) // max Characters
        client.sendPacket(packet)
      }).catch(err => {
        console.log(err, err.stack)
      })
  }
}
