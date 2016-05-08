import PacketBuilder from '../../builder'
import { broadcastMap } from '../helpers'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x27] = function(client, reader) {
    let id = reader.readShort()
    let packet = new PacketBuilder(0xA0)
    if (id === -1) {
      packet.write(0)
      let bPacket = new PacketBuilder(0x97)
      bPacket.writeInt(client.character._id)
      bPacket.writeInt(id)
      broadcastMap(client, bPacket, false)
    } else {
      packet.write(1)
      packet.writeShort(id)
    }
    client.sendPacket(packet).catch(console.log)
  }
}
