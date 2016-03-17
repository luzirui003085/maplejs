import fs from 'fs'
import path from 'path'
const packetProcessor = {}

fs.readdir(path.join(__dirname, '../handlers/world'), (err, files) => {
  if (!err) {
    files.forEach(file => {
      require('../handlers/world/' + file)(packetProcessor)
    })
    console.log('Loaded world packet processor')
  }
})

module.exports = packetProcessor
