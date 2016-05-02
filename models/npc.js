import PacketBuilder from '../packets/builder'
import mongoose, { Schema } from 'mongoose'

let npcSchema = Schema({
  map: Number,
  objectId: Number,
  x: Number,
  y: Number,
  f: Boolean,
  fh: Number,
  cy: Number,
  rx0: Number,
  rx1: Number
})

npcSchema.index({map: 1, objectId: 1}, { unique: true })

npcSchema.statics.getNpcsOnMap = function getNpcsOnMap(map) {
  const tvs = [9201066, 9250023, 9250024, 9250025, 9250026, 9250042, 9250043, 9250044, 9250045, 9250046, 9270000, 9270001, 9270002, 9270003, 9270004, 9270005, 9270006, 9270007, 9270008, 9270009, 9270010, 9270011, 9270012, 9270013, 9270014, 9270015, 9270016, 9270040, 9270066]
  return this.find({map: map, objectId: {$nin: tvs}})
}

npcSchema.methods.createSpawnPacket = function createSpawnPacket() {
  let packet = new PacketBuilder(0xC2)
  packet.writeInt(this.objectId)
  packet.writeInt(this.objectId)
  packet.writeShort(this.x)
  packet.writeShort(this.y)
  packet.write(this.f)
  packet.writeShort(this.fh)
  packet.writeShort(this.rx1)
  packet.writeShort(this.rx2)
  packet.write(1)
  return packet
}

npcSchema.methods.createControlPacket = function createControlPacket() {
  let packet = new PacketBuilder(0xC4)
  packet.write(1)
  packet.writeInt(this.objectId)
  packet.writeInt(this.objectId)
  packet.writeShort(this.x)
  packet.writeShort(this.y)
  packet.write(1)
  packet.writeShort(this.fh)
  packet.writeShort(this.rx1)
  packet.writeShort(this.rx2)
  packet.write(1)
  return packet
}

export default mongoose.model('Npc', npcSchema)
