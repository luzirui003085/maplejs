import { createServer } from './server'
import { initializeDatabase, NUM_WORLDS, NUM_CHANNELS } from './config'
import mapLoader from './loaders/maploader'
import worldProcessor from './packets/processors/world'
import channelProcessor from './packets/processors/channel'
import mongoose from 'mongoose'

initializeDatabase()
  .then(() => {
    for (let world = 0; world < NUM_WORLDS; world++) {
      for (let channel = 0; channel < NUM_CHANNELS; channel++) {
        let port = 7575 + channel
        port += world * 100
        createServer(port, channelProcessor, channel + 1, world)
      }
    }
    let worldServer = createServer(8484, worldProcessor, -1, -1)
  }).catch(console.log)
