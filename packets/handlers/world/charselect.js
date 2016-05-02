import PacketBuilder from '../../builder'
import mongoose from 'mongoose'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x13] = function(client, reader) {
    let charId = reader.readInt()
    let macAddress = reader.readString()
    let packet = new PacketBuilder(0x0C)
    packet.writeShort(0)
    packet.writeArray(client.address.split('.').map(e => +e))
    packet.writeShort(7575 + client.channel - 1)
    packet.writeInt(charId)
    packet.writeArray([0,0,0,0,0])
    client.sendPacket(packet)
  }
}
