import fs from 'fs'
import path from 'path'
const packetProcessor = {}

const IGNORE_CODES = []

fs.readdir(path.join(__dirname, '../handlers/channel'), (err, files) => {
  if (!err) {
    files.forEach(file => {
      require('../handlers/channel/' + file)(packetProcessor)
    })
  }
})

for (let code of IGNORE_CODES) {
  packetProcessor[code] = function(){}
}

module.exports = packetProcessor
