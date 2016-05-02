import { MAPLE_VERSION } from './config'
import net from 'net'
import { morphSequence, encryptPacket, getLengthFromHeader, decryptData } from './socket'
import PacketReader from './packets/reader'
import PacketBuilder from './packets/builder'
import { removeCharacterFromMap } from './packets/handlers/helpers'
import mongoose from 'mongoose'
import store from './store'
import { clientConnected, clientDisconnected } from './store/actions/clients'
import { leftMap } from './store/actions/maps'


export function createServer(port, processor, channel, world) {

  const server = net.createServer(socket => {
    // Send handshake
    socket.sendSequence = [82, 48, 120, 115]
    socket.receiveSequence = [82, 48, 120, 115]

    socket.header = true
    socket.nextBlockLength = 4
    socket.buffer = new Buffer(0)
    socket.server = server
    socket.client = {
      server: server,
      address: socket.address().address
    }

    socket.client.sendPacket = packet => {
      return new Promise((resolve, reject) => {
        let data = encryptPacket(packet, socket.sendSequence,  -15873)
        socket.sendSequence = morphSequence(socket.sendSequence)
        socket.write(data, resolve)
      })
    }

    socket.on('data', receivedData => {
      socket.pause()
      let temp = socket.buffer
      socket.buffer = Buffer.concat([temp, receivedData])
      while (socket.nextBlockLength <= socket.buffer.length) {
        let readingBlock = socket.nextBlockLength
        let data = socket.buffer
        let block = new Buffer(socket.nextBlockLength)
        data.copy(block, 0, 0, block.length)
        socket.buffer = new Buffer(data.length - block.length)
        data.copy(socket.buffer, 0, block.length);
        if (socket.header) {
          socket.nextBlockLength = getLengthFromHeader(block)
        } else {
          socket.nextBlockLength = 4
          decryptData(block, socket.receiveSequence)
          socket.receiveSequence = morphSequence(socket.receiveSequence)
          let reader = new PacketReader(block)
          let handler = server.packetHandler[reader.opCode]
          if (!!handler) {
            try {
              handler(socket.client, reader, store.dispatch)
            } catch(ex) {
              console.error(ex, ex.stack)
            }
          } else {
            console.log('Could not handle opcode', reader.opCode.toString(16))
          }
        }
        socket.header = !socket.header
      }
      socket.resume()
    })

    socket.on('end', () => {
      if (!!socket.client.character) {
        removeCharacterFromMap(socket.client)
        store.dispatch(leftMap(server.key, socket.client.character.map, socket.client))
      }
      store.dispatch(clientDisconnected(server.key, socket.client))
    })

    var packet = new PacketBuilder()
    packet.writeShort(0x0d)
    packet.writeShort(MAPLE_VERSION)
    packet.writeShort(0)
    packet.writeArray(socket.receiveSequence)
    packet.writeArray(socket.sendSequence)
    packet.write(8)
    socket.write(packet.getBufferCopy())
    store.dispatch(clientConnected(server.key, socket.client))
  })

  server.channel = channel
  server.world = world
  server.key = `${world}_${channel}`

  server.startPinger = () => {
    var shit = setInterval(() => {
      var packet = new PacketBuilder(0x0011);
      for (let client of store.getState().clients[server.key]) {
        client.sendPacket(packet)
      }
    }, 15000)
  }

  server.packetHandler = processor
  server.packetHandler[0x0018] = ((client, reader) => {
    client.ponged = true
  })
  // server.startPinger()

  server.listen({
    host: '0.0.0.0',
    port: port
  }, () => {
    console.log('Listening on port', port)
  })
  return server
}
