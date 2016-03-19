export function addCharEntry(packet, char) {
  addCharStats(packet, char)
  addCharLook(packet, char)
  packet.write(0)
}

export function addCharStats(packet, char) {
  packet.writeInt(char.getIntID())
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

function addCharLook(packet, char) {
  packet.write(char.gender)
  packet.write(char.skinColor)
  packet.writeInt(char.face)
  packet.write(0) // mega
  packet.writeInt(char.hair)
  packet.write(0xFF) // after visible items
  packet.write(0xFF) // After masked items
  packet.writeInt(0) // No cash weapon
  packet.writeInt(0)
  packet.writeLong(0)
}
