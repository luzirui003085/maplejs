import PacketBuilder from '../packets/builder'
import mongoose, { Schema } from 'mongoose'

let monsterSchema = Schema({
  id: Number,
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

monsterSchema.methods.createSpawnPacket = function createSpawnPacket() {
  let packet = new PacketBuilder(0xAF)
  packet.writeInt(this.id)
  packet.write(1)
  packet.writeInt(this.objectId)
  packet.write(0)
  packet.writeShort(0)
  packet.write(8)
  packet.writeInt(0)
  packet.writeShort(this.x)
  packet.writeShort(this.y)
  packet.write(5) // stance
  packet.writeShort(0)
  packet.writeShort(this.fh)
  packet.writeShort(-2)
  packet.writeInt(0)
  return packet
}

monsterSchema.methods.createControlPacket = function createControlPacket() {
  let packet = new PacketBuilder(0xB1)
  packet.write(1)
  packet.writeInt(this.id)
  packet.write(1)
  packet.writeInt(this.objectId)
  packet.write(0)
  packet.writeShort(0)
  packet.write(8)
  packet.writeInt(0)
  packet.writeShort(this.x)
  packet.writeShort(this.y)
  packet.write(5) // stance
  packet.writeShort(0)
  packet.writeShort(this.fh)
  packet.writeShort(-2)
  packet.writeInt(0)
  return packet
}

monsterSchema.methods.moveResponsePacket = function moveResponsePacket(moveid) {
  let packet = new PacketBuilder(0xB3)
  packet.writeInt(this.id)
  packet.writeShort(moveid)
  packet.write(0) // Use skills
  packet.writeShort(0) // MP
  packet.write(0) // skillid
  packet.write(0) // skillLevel
  return packet
}

monsterSchema.methods.updateLocation = function updateLocation(movements) {
  let movement = movements[movements.length - 1]
  this.x = movement.xpos
  this.y = movement.ypos
  this.fh = movement.foothold
  this.stance = movement.stance
}

// monsterSchema.methods.movePacket = function movePacket(skill1, skill2, skill3, skill4, skill5, startX, startY, movements) {
//   let packet = new PacketBuilder(0xB2)
//   packet.writeInt(this.id)
//   packet.write(skill1)
//   packet.write(skill2)
//   packet.write(skill3)
//   packet.write(skill4)
//   packet.write(skill5)
//   packet.write(0)
//   packet.writeShort(startX)
//   packet.writeShort(startY)
//   encodeMovements(packet, movements)
//   return packet
// }

monsterSchema.statics.getMonstersOnMap = function getMonstersOnMap(map) {
  return mongoose.model('Monster').find({map})
}

export default mongoose.model('Monster', monsterSchema)
