import { initializeDatabase, MAPLE_VERSION } from './config'
import net from 'net'
import crypto from 'crypto'
import { getHello } from './packets/common'
import { getLengthFromHeader, decryptData, morphSequence, generateHeader, encryptData } from './socket'
import PacketReader from './packets/reader'
import PacketBuilder from './packets/builder'

initializeDatabase()
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Could not connect to database'))

let connectedClients = []

const server = net.createServer(c => {
  console.log(c.address())
  console.log('Connected, sending Hello')
  // Send handshake
  c.receiveSequence = [70, 114, 122, 82;
  c.sendSequence = [70, 114, 122, 82)
  c.write(getHello(MAPLE_VERSION, c.sendSequence, c.receiveSequence))
  c.nextBlockLength = 4
  c.header = true;
  c.ponged = true;
  c.buffer = new Buffer(0)

  c.client = {}
  connectedClients.push(c)

  c.send = packet => {
    let buffer = packet.getBufferCopy()
    let ret = new Buffer(buffer.length + 4)
    let header = generateHeader(c.sendSequence, buffer.length, MAPLE_VERSION)
    encryptData(buffer, c.sendSequence)
    c.sendSequence = morphSequence(c.sendSequence)
    header.copy(ret, 0, 0)
    buffer.copy(ret, 4, 0)
    console.log(ret)
    c.write(ret)
  }

  c.on('end', () => {
    connectedClients.pop(c)
    console.log('Ended')
  })

  c.on('data', data => {
    c.send(new PacketBuilder(data))
    console.log('Received', data)
    const temp = c.buffer
    c.buffer = Buffer.concat([temp, data])

    while (c.nextBlockLength <= c.buffer.length) {
      let readingBlock = c.nextBlockLength
      let data = c.buffer
      let block = new Buffer(c.nextBlockLength)
      data.copy(block, 0, 0, block.length)
      c.buffer = new Buffer(data.length - block.length)
      data.copy(c.buffer, 0, block.length)

      if (c.header) {
        c.nextBlockLength = getLengthFromHeader(block)
      } else {
        c.nextBlockLength = 4
        decryptData(block, c.receiveSequence)
        c.receiveSequence = morphSequence(c.receiveSequence)
        const reader = new PacketReader(block)
        let handler = server.packetProcessor[reader.opCode]
        if (!!handler) {
          handler(c, reader)
        } else {
          console.log('Could not find handler for opcode', reader.opCode)
        }
      }
      c.header = !c.header
    }
  })
}).on('error', err => {
  console.log('whaat')
  throw err
})

server.packetProcessor = require('./packets/processors/world')
server.packetProcessor[0x18] = function(client, reader) {
  console.log('Received pong')
  client.ponged = true
}
server.startPinger = function() {
  let shit = setInterval(() => {
    let packet = new PacketBuilder(0x11);
    for (let client of connectedClients) {
      try {
        console.log('Sending ping')
        client.send(packet)
      } catch (ex) {
        console.log(ex)
      }
    }
  }, 20000)
}

server.listen({
  port: 8484
}, () => {
  console.log('Listening')
  server.startPinger()
})
