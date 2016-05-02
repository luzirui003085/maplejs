import mongoose, { Schema } from 'mongoose'

let mapSchema = Schema({
  _id: Number,
  flags: String,
  shuffleName: String,
  defaultMusic: String,
  minLevel: Number,
  timeLimit: Number,
  regenRate: Number,
  traction: Number,
  topx: Number,
  topy: Number,
  bottomx: Number,
  bottomy: Number,
  returnMap: {
    type: Number,
    ref: 'Map'
  },
  forcedReturnMap: {
    type: Number,
    ref: 'Map'
  },
  fieldType: String,
  fieldLimitations: String,
  decreaseHp: Number,
  damagePerSecond: Number,
  protectItem: Number,
  shipKind: Number,
  mobRate: Number,
  link: {
    type: Number,
    ref: 'Map'
  }
})

mapSchema.statics.initializeMaps = function initializeMaps() {
  return new Promise((resolve, reject) => {
    let maps = {}
    this.find()
      .then(results => {
        results.forEach(map => {
          map.portals = {}
          maps[map._id] = map
        })
        return mongoose.model('MapPortal').find()
      }).then(results => {
        results.forEach(portal => {
          if (!!maps[portal.mapId]) {
            maps[portal.mapId][portal.id] = portal
          }
        })
        resolve(maps)
      }).catch(err => {
        reject(err)
      })
  })
}

export default mongoose.model('Map', mapSchema, 'maps')
