import PacketBuilder from '../../builder'
import { broadcastMap } from '../helpers'
import store from '../../../store'
import { NEUTRAL_START_ID, lootItem } from '../../../store/actions/maps'

module.exports = function packet(packetprocessor) {
  packetprocessor[0xab] = function(client, reader, dispatch) {
    let mode = reader.readByte()
    reader.skip(8)
    let mapItemId = reader.readInt()
    dispatch(lootItem(client, mapItemId))
  }
}
