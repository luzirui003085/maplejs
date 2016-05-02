import mongoose from 'mongoose'
import Promise from 'bluebird'
global.Promise = Promise
mongoose.Promise = Promise
require('dotenv').load()

export const AUTO_REGISTER = true
export const MAPLE_VERSION = 62
export const NUM_WORLDS = 1
export const NUM_CHANNELS = 1


export function initializeDatabase(url=process.env.DATABASE_URL) {
  return mongoose.connect(url)
}

import './models'
