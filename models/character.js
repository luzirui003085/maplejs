import mongoose, { Schema } from 'mongoose'

let characterSchema = Schema({
  world: Number,
  account: {
    type: Schema.Types.ObjectId,
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
  map: Number,
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

characterSchema.methods.getIntID = function getIntID() {
  return parseInt(this._id.toString().substr(0, 8), 16)
}

characterSchema.statics.getFromIntID = function getFromIntID(id) {
  return new Promise((resolve, reject) => {
    this.find()
      .then(results => {
        for (let result of results) {
          if (result.getIntID() === +id) {
            resolve(result)
            break
          }
        }
        resolve(null)
      }).catch(reject)
  })
}

export default mongoose.model('Character', characterSchema)
