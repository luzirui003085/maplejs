import PacketBuilder from '../../builder'
import { parseMovement, encodeMovements, broadcastMap } from '../helpers'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x26] = function(client, reader) {
    reader.skip(5)
    let movements = parseMovement(reader)
    client.character.location = movements[movements.length - 1]
    let packet = new PacketBuilder(0x8D)
    packet.writeInt(client.character._id)
    packet.writeInt(0)
    encodeMovements(packet, movements)
    broadcastMap(client, packet, false)
  }
}
