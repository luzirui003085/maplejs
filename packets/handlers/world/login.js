import mongoose from 'mongoose'
import PacketBuilder from '../../builder'
import { AUTO_REGISTER } from '../../../config'

module.exports = function packet(packetprocessor) {
  packetprocessor[0x0001] = login
}

function login(client, reader) {
  let username = reader.readString()
  let password = reader.readString()
  let packet = new PacketBuilder(0x00)
  mongoose.model('Account').findOne({
    username
  }).then(account => {
    if (!!account) {
      if (account.password === password) {
        return Promise.resolve(account)
      } else {
        return Promise.resolve(null)
      }
    } else {
      if (AUTO_REGISTER === true) {
        return mongoose.model('Account').create({
          username,
          password
        })
      }
    }
  }).then(account => {
    if (account === null) {
      packet.writeInt(4)
      packet.writeShort(0)
      client.sendPacket(packet)
    } else {
      client.account = account
      packet.writeArray([0, 0, 0, 0, 0, 0, 0xFF, 0x6A, 1, 0, 0, 0, 0x4E])
      packet.writeString(account.username)
      packet.writeArray([3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xDC, 0x3D, 0x0B, 0x28, 0x64, 0xC5, 1, 8, 0, 0, 0])
      client.sendPacket(packet)
    }
  }).catch(err => {
    console.log(err, err.stack)
  })
}

