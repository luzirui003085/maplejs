import store from '../../store'
import PacketBuilder from '../builder'
import mongoose from 'mongoose'

export function addCharEntry(packet, char, equips=[]) {
  addCharStats(packet, char)
  addCharLook(packet, char, equips)
  packet.write(0)
}

export function addCharStats(packet, char) {
  packet.writeInt(char._id)
  packet.writeString(char.name, 13)
  packet.write(char.gender)
  packet.write(char.skinColor)
  packet.writeInt(char.face)
  packet.writeInt(char.hair)
  packet.writeLong(0)
  packet.writeLong(0)
  packet.writeLong(0)
  packet.write(char.level)
  packet.writeShort(char.job)
  packet.writeShort(char.str)
  packet.writeShort(char.dex)
  packet.writeShort(char.int)
  packet.writeShort(char.luk)
  packet.writeShort(char.hp)
  packet.writeShort(char.maxhp)
  packet.writeShort(char.mp)
  packet.writeShort(char.maxmp)
  packet.writeShort(char.ap)
  packet.writeShort(char.sp)
  packet.writeInt(char.exp)
  packet.writeShort(char.fame)
  packet.writeInt(0)
  packet.writeInt(char.map)
  packet.write(char.spawnPoint)
  packet.writeInt(0)
}

function addCharLook(packet, char, equips) {
  packet.write(char.gender)
  packet.write(char.skinColor)
  packet.writeInt(char.face)
  packet.write(0) // mega
  packet.writeInt(char.hair)
  equips.forEach(equip => {
    packet.write(equip.position * -1)
    if (!!equip.item._id)
      packet.writeInt(equip.item._id)
    else packet.writeInt(equip.item)
  })
  packet.write(0xFF) // after visible items
  packet.write(0xFF) // After masked items
  packet.writeInt(0) // No cash weapon
  packet.writeInt(0)
  packet.writeLong(0)
}

export function parseMovement(packet) {
  let movements = []
  let numCommands = packet.readByte()
  for (let i = 0; i < numCommands; i++) {
    let command = packet.readByte()
    let movement = {
      type: command,
      xpos: 0,
      ypos: 0,
      xwobble: 0,
      ywobble: 0,
      flushDelay: 0,
      stance: 0,
      foothold: 0,
      unknown1: 0,
      unknown2: 0
    }
    switch(command) {
      case 0: // Normal move
      case 5:
      case 17:
        movement.xpos = packet.readShort()
        movement.ypos = packet.readShort()
        movement.xwobble = packet.readShort()
        movement.ywobble = packet.readShort()
        movement.flushDelay = packet.readShort()
        movement.stance = packet.readByte()
        movement.foothold = packet.readShort()
        break
      case 1:
      case 2:
      case 6:
      case 12:
      case 13:
      case 16:
        movement.xpos = packet.readShort()
        movement.ypos = packet.readShort()
        movement.stance = packet.readByte()
        movement.foothold = packet.readShort()
        break
      case 3:
      case 4:
      case 7:
      case 8:
      case 9:
      case 14:
        movement.xpos = packet.readShort()
        movement.ypos = packet.readShort()
        movement.xwobble = packet.readShort()
        movement.ywobble = packet.readShort()
        movement.stance = packet.readByte()
        break
      case 10:
        movement.unknown1 = packet.readByte() // equip?
        break
      case 11:
        movement.xpos = packet.readShort()
        movement.ypos = packet.readShort()
        movement.flushDelay = packet.readShort()
        movement.stance = packet.readByte()
        movement.foothold = packet.readShort()
        break
      case 15:
        movement.xpos = packet.readShort()
        movement.ypos = packet.readShort()
        movement.xwobble = packet.readShort()
        movement.ywobble = packet.readShort()
        movement.flushDelay = packet.readShort()
        movement.unknown2 = packet.readShort()
        movement.stance = packet.readByte()
        movement.foothold = packet.readShort()
        break
      default:
        console.log('Could not parse command', packet)
    }
    movements.push(movement)
  }
  return movements
}

export function encodeMovements(packet, movements) {
  packet.write(movements.length)
  for (let movement of movements) {
    packet.write(movement.type)
    switch(movement.type) {
      case 0: // Normal move
      case 5:
      case 17:
        packet.writeShort(movement.xpos)
        packet.writeShort(movement.ypos)
        packet.writeShort(movement.xwobble)
        packet.writeShort(movement.ywobble)
        packet.writeShort(movement.flushDelay)
        packet.write(movement.stance)
        packet.writeShort(movement.foothold)
        break
      case 1:
      case 2:
      case 6:
      case 12:
      case 13:
      case 16:
        packet.writeShort(movement.xpos)
        packet.writeShort(movement.ypos)
        packet.write(movement.stance)
        packet.writeShort(movement.foothold)
        break
      case 3:
      case 4:
      case 7:
      case 8:
      case 9:
      case 14:
        packet.writeShort(movement.xpos)
        packet.writeShort(movement.ypos)
        packet.writeShort(movement.xwobble)
        packet.writeShort(movement.ywobble)
        packet.write(movement.stance)
        break
      case 10:
        packet.write(movement.unknown1)
        break
      case 11:
        packet.writeShort(movement.xpos)
        packet.writeShort(movement.ypos)
        packet.writeShort(movement.flushDelay)
        packet.write(movement.stance)
        packet.writeShort(movement.foothold)
        break
      case 15:
        packet.writeShort(movement.xpos)
        packet.writeShort(movement.ypos)
        packet.writeShort(movement.xwobble)
        packet.writeShort(movement.ywobble)
        packet.writeShort(movement.flushDelay)
        packet.writeShort(movement.unknown2)
        packet.write(movement.stance)
        packet.writeShort(movement.foothold)
        break
      default:
        console.log('Could not encode command', movement)
    }
  }
}

export function broadcastMap(client, packet, self=true) {
  store.getState().maps[client.server.key][client.character.map].clients.forEach(other => {
    if (!self && client.character._id === other.character._id)
      return
    other.sendPacket(packet).catch(console.log)
  })
}

export function removeCharacterFromMap(client) {
  let packet = new PacketBuilder(0x79)
  packet.writeInt(client.character._id)
  broadcastMap(client, packet, false)
}

export function addCharacterToMap(client) {
  // // Broadcast the user entering, here i come
  // store.getMap(client).clients.forEach(other => {
  //   client.sendPacket(spawnPlayerObject(other.character))
  // })
  // store.getMap(client).clients.forEach(other => {
  //   other.sendPacket(spawnPlayerObject(client.character))
  // })

  // mongoose.model('Npc').getNpcsOnMap(client.character.map)
  //   .then(results => {
  //     return Promise.map(results, npc => {
  //       return client.sendPacket(npc.createSpawnPacket())
  //         .then(() => client.sendPacket(npc.createControlPacket()))
  //     })
  //   }).catch(console.log)
  // mongoose.model('Monster').getMonstersOnMap(client.character.map)
  //   .then(results => {
  //     return Promise.map(results, monster => {
  //       return client.sendPacket(monster.createSpawnPacket())
  //         .then(() => client.sendPacket(monster.createControlPacket()))
  //     })
  //   }).catch(console.log)
}

export function spawnPlayerObject(character) {
  let packet = new PacketBuilder(0x78)
  packet.writeInt(character._id)
  packet.writeString(character.name)
  // Assuming no guild
  packet.writeString("")
  packet.writeArray([0,0,0,0,0,0])
  packet.writeInt(0)
  packet.writeInt(1)
  packet.write(0)
  packet.writeShort(0)
  packet.write(0xF8)
  let buffmask = 0
  packet.writeInt(0)
  packet.writeInt(0)
  let random = Math.floor(Math.random() * 100)
  packet.writeInt(0)
  packet.writeShort(0)
  packet.writeInt(random)
  packet.writeLong(0)
  packet.writeShort(0)
  packet.writeInt(random)
  packet.writeLong(0)
  packet.writeShort(0)
  packet.writeInt(random)
  packet.writeShort(0)
  packet.writeLong(0)
  packet.writeInt(random)
  packet.writeLong(0)
  packet.writeInt(random)
  packet.writeLong(0)
  packet.writeInt(0)
  packet.writeShort(0)
  packet.writeInt(random)
  packet.writeInt(0)
  packet.write(0x40)
  packet.write(1)
  addCharLook(packet, character, character.items.filter(i => i.position < 0))
  packet.writeInt(0)
  packet.writeInt(0)
  packet.writeInt(0)
  packet.writeShort(character.location.xpos)
  packet.writeShort(character.location.ypos)
  packet.write(character.location.stance)
  packet.writeInt(0)
  packet.writeInt(1)
  packet.writeLong(0)
  packet.write(0)
  packet.write(0)
  // Rings
  packet.writeInt(0)
  return packet
}


export function moveItemPacket(type, src, dst, equipInfo) {
  let packet = new PacketBuilder(0x1A)
  packet.writeArray([0x01, 0x01, 0x02])
  packet.write(type)
  packet.writeShort(src)
  packet.writeShort(dst)
  if (equipInfo !== -1) {
    packet.write(1)
  }
  return packet
}

export function updateCharLook(character) {
  let packet = new PacketBuilder(0x98)
  packet.writeInt(character._id)
  packet.write(1)
  addCharLook(packet, character, character.items.filter(i => i.position < 0))
  packet.writeInt(0)
  return packet
}

export function spawnItemDropPacket(item, itemMapId, character) {
  let packet = new PacketBuilder(0xCD)
  packet.write(1) // mod
  packet.writeInt(itemMapId)
  packet.write(0)
  packet.writeInt(item.item._id ? item.item._id : item.item)
  packet.writeInt(0) // owner
  packet.write(0)
  packet.writeShort(character.location.x)
  packet.writeShort(character.location.y)
  packet.writeInt(0) // owner
  packet.writeShort(character.location.x)
  packet.writeShort(character.location.y)
  packet.write(0)
  packet.write(0)
  packet.write(1)
  packet.writeArray([0x80, 5])
  packet.writeInt(400967355)
  packet.write(2)
  packet.write(1)
  return packet
}
