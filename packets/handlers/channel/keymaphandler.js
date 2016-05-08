import PacketBuilder from '../../builder'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x7B] = function(client, reader) {
    reader.skip(4)
    let numChanges = reader.readInt()
    console.log(numChanges, 'keymap changes')
  }
}
