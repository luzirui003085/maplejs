import mongoose, { Schema } from 'mongoose'

let counterSchema = Schema({
  seq: {
    type: Number,
    default: 0
  }
})
const Counter = mongoose.model('CharacterCounter', counterSchema)

let characterSchema = Schema({
  _id: {
    type: Number,
    index: true
  },
  world: Number,
  account: {
    type: Number,
    ref: 'Account'
  },
  name: String,
  level: {
    type: Number,
    default: 1
  },
  exp: {
    type: Number,
    default: 0
  },
  str: Number,
  dex: Number,
  int: Number,
  luk: Number,
  hp: {
    type: Number,
    default: 50
  },
  mp: {
    type: Number,
    default: 5
  },
  maxhp: {
    type: Number,
    default: 50
  },
  maxmp: {
    type: Number,
    default: 5
  },
  job: {
    type: Number,
    default: 0
  },
  mesos: {
    type: Number,
    default: 0
  },
  skinColor: Number,
  gender: Number,
  fame: {
    type: Number,
    default: 0
  },
  hair: Number,
  face: Number,
  ap: Number,
  sp: Number,
  map: {
    type: Number,
    default: 100000000
  },
  spawnPoint: Number,
  gm: Number,
  party: Number,
  equipSlots: {
    type: Number,
    default: 96
  },
  useSlots: {
    type: Number,
    default: 96
  },
  setupSlots: {
    type: Number,
    default: 96
  },
  etcSlots: {
    type: Number,
    default: 96
  },
  cashSlots: {
    type: Number,
    default: 96
  }
})

characterSchema.pre('save', function(next) {
  if (this._id)
    return next()
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

export default mongoose.model('Character', characterSchema)
