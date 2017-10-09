import mongoose, { Schema } from 'mongoose'
import { itemStatSchema } from './itemStats'
import PacketBuilder from '../packets/builder'

const itemSchema = Schema({
  character: {
    type: Number,
    ref: 'Character'
  },
  storage: Number,
  stats: itemStatSchema,
  inventory: Number,
  position: Number,
  quantity: {
    type: Number,
    default: 1
  },
  owner: Number
})

itemSchema.statics.createItem = function createItem(item, character, position, quantity=1) {
  return new Promise((resolve, reject) => {
    mongoose.model('ItemStats').findOne({_id: item}).lean()
      .then(stats => {
        return this.create({
          stats,
          character,
          position,
          inventory: Math.floor(item / 1000000)
        })
      }).then(resolve)
      .catch(reject)
  })
}


export default mongoose.model('Item', itemSchema)
