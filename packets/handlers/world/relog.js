import PacketBuilder from '../../builder'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x1C] = function(client, reader) {
    let packet = new PacketBuilder(0x16)
    packet.write(1)
    client.sendPacket(packet)
  }
}
