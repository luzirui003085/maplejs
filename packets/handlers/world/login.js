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
    console.log(account)
    if (!!account) {
      if (account.password === password) {
        return Promise.resolve(account)
      } else {
        return Promise.reject({message: 'Wrong password'})
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
    console.log('Oh yeah')
    client.account = account
    packet.writeShort(0)
    packet.writeInt(0)
    packet.writeInt(account.getIntID())
    packet.write(0) // admin flag
    packet.write(0)
    packet.write(0)
    packet.writeString(account.username)
    packet.write(0)
    packet.write(0)
    packet.writeDate(new Date())
    packet.writeDate(new Date())
    packet.writeInt(0)
    packet.write(true)
    packet.write(1)
    client.send(packet)
  }).catch(err => {
    packet.writeInt(4)
    packet.writeShort(0)
    client.send(packet)
  })
}

