import mongoose from 'mongoose'
mongoose.Promise = Promise
require('dotenv').load()

import './models'

export function initializeDatabase() {
  return mongoose.connect(process.env.DATABASE_URL)
}

export const AUTO_REGISTER = true
export const MAPLE_VERSION = 62
export const NUM_WORLDS = 1
export const NUM_CHANNELS = 1
