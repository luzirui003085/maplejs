import PacketBuilder from '../../builder'
import { broadcastMap, parseMovement, encodeMovements } from '../helpers'
import store from '../../../store'
import { moveMonster } from '../../../store/actions/maps'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x9D] = function(client, reader, dispatch) {
    const monsterId = reader.readInt()
    const moveid = reader.readShort()
    const map = store.getMap(client)
    const monster = map.monsters.find(m => m.id === monsterId)
    if (!monster) {
      console.log('Could not find monster', moveid)
      return
    }
    const skill1 = reader.readByte()
    const skill2 = reader.readByte()
    const skill3 = reader.readByte() & 0xFF
    const skill4 = reader.readByte()
    const skill5 = reader.readByte()
    const skill6 = reader.readByte()
    reader.skip(5)
    const startX = reader.readShort()
    const startY = reader.readShort()
    const movements = parseMovement(reader)
    client.sendPacket(monster.moveResponsePacket(moveid))
      .then(() => {
        monster.updateLocation(movements)
        let packet = new PacketBuilder(0xB2)
        packet.writeInt(monsterId)
        packet.write(skill1)
        packet.write(skill2)
        packet.write(skill3)
        packet.write(skill4)
        packet.write(skill5)
        packet.write(0)
        packet.writeShort(startX)
        packet.writeShort(startY)
        encodeMovements(packet, movements)
        broadcastMap(client, packet, false)
      }).catch(console.log)
  }
}
