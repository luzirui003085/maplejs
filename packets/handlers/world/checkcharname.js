import PacketBuilder from '../../builder'
import mongoose from 'mongoose'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x15] = function(client, reader) {
    let packet = new PacketBuilder(0x0D)
    let name = reader.readString()
    mongoose.model('Character')
      .findOne({
        world: client.world,
        name: name
      }).then(character => {
        packet.writeString(name)
        packet.write(!!character ? 1 : 0)
        client.sendPacket(packet)
      }).catch(err => {
        console.log(err, err.stack)
      })
  }
}
