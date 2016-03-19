import PacketBuilder from '../../builder'
import { NUM_WORLDS, NUM_CHANNELS } from '../../../config'


module.exports = function packet(packetprocessor) {
  packetprocessor[0x06] = function(client, reader) {
    let packet = new PacketBuilder(0x03)
    packet.writeShort(0)
    client.sendPacket(packet)
  }
}
