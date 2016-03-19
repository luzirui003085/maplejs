import PacketBuilder from '../../builder'
import { NUM_WORLDS, NUM_CHANNELS } from '../../../config'


module.exports = function packet(packetprocessor) {
  packetprocessor[0x0B] = function(client, reader) {
    for (let i = 0; i < NUM_WORLDS; i ++) {
      let packet = new PacketBuilder(0x0A)
      packet.write(i) // worldId
      packet.writeString('martin')
      packet.write(1) // flag
      packet.writeString('Event message')
      packet.write(0x64); // rate modifier, don't ask O.O!
      packet.write(0x0); // event xp * 2.6 O.O!
      packet.write(0x64); // rate modifier, don't ask O.O!
      packet.write(0x0); // drop rate * 2.6
      packet.write(0x0);
      packet.write(NUM_CHANNELS)
      for (let j = 0; j < NUM_CHANNELS; j++) {
        packet.writeString('martin-' + (j + 1))
        packet.writeInt(1200)
        packet.write(1)
        packet.writeShort(j)
      }
      packet.writeShort(0)
      client.sendPacket(packet)
    }
    let packet = new PacketBuilder(0x0A)
    packet.write(0xFF)
    client.sendPacket(packet)
  }
}
