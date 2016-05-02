import fs from 'fs'
import path from 'path'
const packetProcessor = {}

const IGNORE_CODES = [0x1A, 0xC0]

let files = fs.readdirSync(path.join(__dirname, '../handlers/world'))
files.forEach(file => {
  require('../handlers/world/' + file)(packetProcessor)
})

for (let code of IGNORE_CODES) {
  packetProcessor[code] = function(){}
}

module.exports = packetProcessor
