import PacketBuilder from './builder'


export function getHello(mapleVersion, sendSequence, receiveSequence) {
  const builder = new PacketBuilder(undefined, 16)
  builder.writeShort(0x0d)
  builder.writeShort(mapleVersion)
  builder.writeShort(0)
  builder.writeArray(receiveSequence)
  builder.writeArray(sendSequence)
  builder.write(8)
  return builder.buffer
}
