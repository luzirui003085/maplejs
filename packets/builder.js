export default class PacketBuilder {
  constructor(opCode) {
    this.buffer = new Buffer(256)
    this.count = 0
    this.write = this.write.bind(this)
    this.writeShort = this.writeShort.bind(this)
    this.writeArray = this.writeArray.bind(this)
    this.writeInt = this.writeInt.bind(this)
    this.writeLong = this.writeLong.bind(this)

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

  writeLong(val) {
    this.write(val & 0xFF)
    this.write((val >>> 8) & 0xFF)
    this.write((val >>> 16) & 0xFF)
    this.write((val >>> 24) & 0xFF)
    this.write((val >>> 32) & 0xFF)
    this.write((val >>> 40) & 0xFF)
    this.write((val >>> 48) & 0xFF)
    this.write((val >>> 56) & 0xFF)
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
