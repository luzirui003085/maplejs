import PacketBuilder from '../../builder'
import mongoose from 'mongoose'
import { addCharStats, addCharacterToMap } from '../helpers'
import { enterMap } from '../../../store/actions/maps'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x14] = function(client, reader, dispatch) {
    let charId = reader.readInt()
    Promise.join(mongoose.model('Character').findOne({_id: charId}),
                 mongoose.model('Item').find({character: charId}).populate('item'))
      .spread((char, items) => {
        client.character = char
        client.character.location = {
          xpos: 0,
          ypos: 0,
          stance: 0,
          foothold: 0
        }
        let packet = new PacketBuilder(0x5C)
        packet.writeInt(client.server.channel - 1)
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
        client.character.items = new Map()
        items.forEach(item => {
          client.character.items.set(item.position, item)
        })
        let equips = [...client.character.items.values()].filter(i => i.position < 0)
        equips.sort((a, b) => {
          return Math.abs(b) - Math.abs(a)
        }).forEach(item => {
          let stats = item.stats
          packet.write(item.position * -1)
          packet.write(1)
          packet.writeInt(stats._id)
          packet.writeShort(0)
          packet.writeArray([0x80, 5])
          packet.writeInt(400967355)
          packet.write(2)
          packet.write(stats.tuc)
          packet.write(0) // level
          packet.writeShort(stats.incSTR)
          packet.writeShort(stats.incDEX)
          packet.writeShort(stats.incINT)
          packet.writeShort(stats.incLUK)
          packet.writeShort(0) // HP
          packet.writeShort(0) // MP
          packet.writeShort(stats.incPAD) // WATK
          packet.writeShort(0) // MATK
          packet.writeShort(0) // WDEF
          packet.writeShort(0) // MDEF
          packet.writeShort(0) // acc
          packet.writeShort(0) // acoid
          packet.writeShort(0) // hands
          packet.writeShort(0) // speed
          packet.writeShort(0) // jump
          packet.writeString("") // owner
          packet.write(0) // locked
          packet.write(0)
          packet.writeLong(0)
        })
        packet.writeShort(0) // start of equip inv
        let equipInventory = [...client.character.items.values()].filter(i => i.position > 0)
        equipInventory.forEach(item => {
          let stats = item.stats
          packet.write(item.position)
          packet.write(1) // equip not item
          packet.writeInt(stats._id)
          packet.writeShort(0)
          packet.writeArray([0x80, 5])
          packet.writeInt(400967355)
          packet.write(2)
          packet.write(stats.tuc)
          packet.write(0) // level
          packet.writeShort(stats.incSTR)
          packet.writeShort(stats.incDEX)
          packet.writeShort(stats.incINT)
          packet.writeShort(stats.incLUK)
          packet.writeShort(0) // HP
          packet.writeShort(0) // MP
          packet.writeShort(0) // WATK
          packet.writeShort(0) // MATK
          packet.writeShort(0) // WDEF
          packet.writeShort(0) // MDEF
          packet.writeShort(0) // acc
          packet.writeShort(0) // acoid
          packet.writeShort(0) // hands
          packet.writeShort(0) // speed
          packet.writeShort(0) // jump
          packet.writeString("") // owner
          packet.write(0) // locked
          packet.write(0)
          packet.writeLong(0)
        })
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
        return client.sendPacket(packet)
      }).then(() => dispatch(enterMap(client)))
      .then(() => {
        addCharacterToMap(client)
        // let packet = new PacketBuilder(0x107)
        // packet.write(0)
        // for (let i=0; i<90; i++) {
        //   packet.write(0)
        //   packet.writeInt(0)
        // }
        // client.sendPacket(packet)
      }).catch(err => {
        console.log('Error in shit', err, err.stack)
      })
  }
}
