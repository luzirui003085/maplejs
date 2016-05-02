export default class PacketReader {
  constructor(buffer) {
    this.buffer = buffer
    this.offset = 0
    this.readShort = this.readShort.bind(this)
    this.readString = this.readString.bind(this)
    this.readInt = this.readInt.bind(this)
    this.skip = this.skip.bind(this)
    this.opCode = this.readShort()
    this.available = this.available.bind(this)
  }

  available() {
    return this.buffer.length - this.offset
  }

  skip(val) {
    this.offset += val
  }

  readShort() {
    let byte1 = this.readByte()
    let byte2 = this.readByte()
    let ret = (byte2 << 8) + byte1
    return (byte2 << 8) + byte1
  }

  readInt() {
    let b1 = this.readByte()
    let b2 = this.readByte()
    let b3 = this.readByte()
    let b4 = this.readByte()
    return (b4 << 24) + (b3 << 16) + (b2 << 8) + b1
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
