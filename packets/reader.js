export default class PacketReader {
  constructor(buffer) {
    this.buffer = buffer
    this.offset = 0
    this.opCode = this.readShort()
    this.readShort = this.readShort.bind(this)
    this.readString = this.readString.bind(this)
  }

  readShort() {
    const ret = this.buffer.readUInt16LE(this.offset)
    this.offset += 2
    return ret
  }

  readByte() {
    return this.buffer.readUInt8(this.offset++)
  }

  readString(length) {
    length = length || this.readShort()
    let ret = '';
    for (; length > 0; length --) {
      let byte = this.readByte()
      if (byte === 0) break
        ret += String.fromCharCode(byte)
    }
    this.offset += length
    return ret
  }
}
