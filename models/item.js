import mongoose, { Schema } from 'mongoose'

const itemSchema = Schema({
  character: {
    type: Number,
    ref: 'Character'
  },
  storage: Number,
  item: {
    type: Number,
    ref: 'ItemStats'
  },
  inventory: Number,
  position: Number,
  quantity: {
    type: Number,
    default: 1
  },
  owner: Number
})

itemSchema.statics.createItem = function createItem(item, character, position, quantity=1) {
  return this.create({
    item,
    character,
    position,
    inventory: parseInt(item / 1000000)
  })
}
export default mongoose.model('Item', itemSchema)
