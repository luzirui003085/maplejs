import PacketBuilder from '../../builder'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x09] = afterLogin
}

function afterLogin(client, reader) {
  let packet = new PacketBuilder(0x06)
  packet.write(0)
  client.sendPacket(packet)
}
