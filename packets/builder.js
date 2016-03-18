export default class PacketBuilder {
  constructor(opCode) {
    this.buffer = new Buffer(128)
    this.count = 0
    this.writeShort = this.writeShort.bind(this)
    this.write = this.write.bind(this)
    this.writeArray = this.writeArray.bind(this)

    if (opCode !== undefined) {
      this.writeShort(opCode)
    }
  }

  writeShort(val) {
    this.buffer.writeUInt16LE(val, this.count)
    this.count += 2
  }

  writeInt(val) {
    this.buffer.writeUInt32LE(val, this.count)
    this.count += 4
  }

  write(val) {
    this.buffer.writeUInt8(val, this.count)
    this.count += 1
  }

  writeArray(arr) {
    arr.forEach(elem => this.write(elem))
  }

  writeString(val, length) {
    if (val === 'undefined')
      val = ''
    if (length === undefined) {
      this.writeShort(val.length)
      this.buffer.write(val, this.count, val.length)
      this.count += val.length
    } else {
      this.buffer.fill(0, this.count, this.count + length)
      this.buffer.write(val, this.count, val.length)
      this.count += length
    }
  }

  writeDate(date) {
    this.writeInt(0)
    this.writeInt(0)
  }

  getBufferCopy() {
    let buffer = new Buffer(this.count)
    this.buffer.copy(buffer)
    return buffer
  }
}
