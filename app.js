import { createServer } from './server'
import { initializeDatabase, NUM_WORLDS, NUM_CHANNELS } from './config'
import worldProcessor from './packets/processors/world'
import channelProcessor from './packets/processors/channel'

initializeDatabase()
  .then(console.log('Connected'))
  .catch(console.log)

for (let world = 0; world < NUM_WORLDS; world++) {
  for (let channel = 0; channel < NUM_CHANNELS; channel++) {
    let port = 7575 + channel
    port += world * 100
    createServer(port, channelProcessor)
  }
}

let worldServer = createServer(8484, worldProcessor)
