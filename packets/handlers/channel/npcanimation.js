import PacketBuilder from '../../builder'
import { broadcastMap } from '../helpers'

module.exports = function packet(packetprocessor) {
  packetprocessor[0xa6] = function(client, reader) {
    let length = reader.available()
    let packet = new PacketBuilder(0xC5)
    if (length === 6) {
      packet.writeInt(reader.readInt())
      packet.writeShort(reader.readShort())
      client.sendPacket(packet)
    } else if (length > 6) {
      packet.writeShort(0xC5)
      for (let i = 0; i < length - 9; i++)
        packet.write(reader.readByte())
      client.sendPacket(packet)
    }
  }
}
