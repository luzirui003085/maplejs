import PacketBuilder from '../../builder'
import { parseDamage, addAttackBody, broadcastMap } from '../helpers'
import store from '../../../store'
import { killMonster } from '../../../store/actions/maps'


module.exports = function packet(packetprocessor) {
  packetprocessor[0x29] = function(client, reader, dispatch) {
    let attackInfo = parseDamage(reader, false)
    let attackPacket = new PacketBuilder(0x8E)
    addAttackBody(attackPacket, client.character._id, attackInfo, 0)
    broadcastMap(client, attackPacket, false)

    attackInfo.attacks.forEach((damages, oid) => {
      let monster = store.getMap(client).monsters.find(m => m.id === oid)
      if (!monster) {
        console.log("Can't find monsters that was attacked")
      } else {
        monster.takeDamage(damages.reduce((p, c) => p + c))
        if (monster.currentHP === 0) {
          dispatch(killMonster(client, monster))
        } else {
          broadcastMap(client, monster.getHPBarPacket())
        }
      }
    })
  }
}
