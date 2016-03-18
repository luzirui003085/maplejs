import { initializeDatabase, MAPLE_VERSION } from './config'
import net from 'net'
import { morphSequence, encryptPacket, getLengthFromHeader, decryptData } from './socket'
import PacketReader from './packets/reader'
import PacketBuilder from './packets/builder'

initializeDatabase()
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Could not connect to database'))

let connectedClients = []

const server = net.createServer(socket => {
  console.log('Connected, sending Hello')
  // Send handshake
  socket.sendSequence = [82, 48, 120, 115]
  socket.receiveSequence = [82, 48, 120, 115]
  connectedClients.push(socket)

  socket.header = true
  socket.nextBlockLength = 4
  socket.buffer = new Buffer(0)

  var packet = new PacketBuilder()
  packet.writeShort(0x0d)
  packet.writeShort(MAPLE_VERSION)
  packet.writeShort(0)
  packet.writeArray(socket.receiveSequence)
  packet.writeArray(socket.sendSequence)
  packet.write(8)
  socket.write(packet.getBufferCopy())

  socket.sendPacket = packet => {
    let data = encryptPacket(packet, socket.sendSequence,  -15873)
    socket.sendSequence = morphSequence(socket.sendSequence)
    socket.write(data)
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
            handler(socket, reader)
          } catch(ex) {
            console.error(ex, ex.stack)
          }
        } else {
          console.log('Could not handle opcode', reader.opCode)
        }
      }
      socket.header = !socket.header
    }
    socket.resume()
  })
})

server.startPinger = function() {
  var shit = setInterval(() => {
    var packet = new PacketBuilder(0x0011);
    for (var i=0; i < connectedClients.length; i++) {
      try {
        connectedClients[i].sendPacket(packet)
      } catch (ex) {
        console.log(ex)
      }
    }
  }, 15000)
}

server.packetHandler = require('./packets/processors/world')
server.packetHandler[0x0018] = ((client, reader) => {
  client.ponged = true
})

server.listen(8484)
server.startPinger()


