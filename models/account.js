import mongoose, { Schema } from 'mongoose'

let counterSchema = Schema({
  seq: {
    type: Number,
    default: 0
  }
})
const Counter = mongoose.model('AccountCounter', counterSchema)

let accountSchema = Schema({
  _id: {
    type: Number,
    index: true
  },
  username: {
    type: String,
    unique: true
  },
  password: String,
  female: Boolean,
  isAdmin: {
    type: Boolean,
    default: false
  }
})

accountSchema.pre('save', function(next) {
  if (this._id)
    next()
  Counter.findOneAndUpdate({}, {
    $inc: {
      seq: 1
    }
  }, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  }).then(res => {
    this._id = res.seq
    next()
  })
})

export default mongoose.model('Account', accountSchema)
