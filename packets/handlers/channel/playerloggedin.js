import PacketBuilder from '../../builder'
import mongoose from 'mongoose'
import { addCharStats } from '../helpers'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x14] = function(client, reader) {
    let charId = reader.readInt()
    mongoose.model('Character').getFromIntID(charId)
      .then(char => {
        let packet = new PacketBuilder(0x5C)
        packet.writeInt(0) // Channel - need to get this from somewhere
        packet.write(1)
        packet.write(1)
        packet.writeShort(0)
        packet.writeInt(Math.floor(Math.random() * (100000 - 1)) + 1)
        packet.writeArray([0xF8, 0x17, 0xD7, 0x13, 0xCD, 0xC5, 0xAD, 0x78])
        packet.writeLong(-1)
        addCharStats(packet, char)
        packet.write(10) // buddy capacity
        packet.writeInt(char.mesos)
        packet.write(100)
        packet.write(100)
        packet.write(100)
        packet.write(100)
        packet.write(100) // slots
        packet.writeShort(0) // start of equip inv
        packet.write(0) // start of use inv
        packet.write(0) // start of setup inv
        packet.write(0) // start of etc inv
        packet.write(0) // start of cash inv
        packet.write(0) // start of skills
        packet.writeShort(0) // num skills
        packet.writeShort(0) // num cooldowns
        packet.writeShort(0) // started quests
        packet.writeShort(0) // completed quests
        packet.writeShort(0) // minigame
        packet.writeShort(0) // start rings
        packet.writeShort(0)
        packet.writeShort(0) // end rings
        // Start rocks
        for (let i = 0; i < 5; i++) packet.writeInt(999999999)
        for (let i = 0; i < 10; i++) packet.writeInt(999999999)
        // End rocks
        packet.writeInt(0)
        packet.writeLong(0)
        client.sendPacket(packet)
        packet = new PacketBuilder(0x107)
        packet.write(0)
        for (let i=0; i<90; i++) {
          packet.write(0)
          packet.writeInt(0)
        }
        client.sendPacket(packet)
      })
  }
}
