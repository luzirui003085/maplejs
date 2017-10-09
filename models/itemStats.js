import mongoose, { Schema } from 'mongoose'

export const itemStatSchema = new Schema({
  _id: {
    type: Number,
    index: true
  },
  acc: {
    type: Number,
    default: 0
  },
  afterImage: {
    type: String,
    default: 0
  },
  attackSpeed: {
    type: Number,
    default: 0
  },
  cash: {
    type: Number,
    default: 0
  },
  chatBalloon: {
    type: Number,
    default: 0
  },
  consumeHP: {
    type: Number,
    default: 0
  },
  consumeMP: {
    type: Number,
    default: 0
  },
  elemDefault: {
    type: Number,
    default: 0
  },
  expireOnLogout: {
    type: Number,
    default: 0
  },
  fs: {
    type: Number,
    default: 0
  },
  hide: {
    type: Number,
    default: 0
  },
  hpRecovery: {
    type: Number,
    default: 0
  },
  ignorePickup: {
    type: Number,
    default: 0
  },
  incACC: {
    type: Number,
    default: 0
  },
  incCraft: {
    type: Number,
    default: 0
  },
  incDEX: {
    type: Number,
    default: 0
  },
  incEVA: {
    type: Number,
    default: 0
  },
  incFatigue: {
    type: Number,
    default: 0
  },
  incINT: {
    type: Number,
    default: 0
  },
  incJump: {
    type: Number,
    default: 0
  },
  incLUK: {
    type: Number,
    default: 0
  },
  incMAD: {
    type: Number,
    default: 0
  },
  incMDD: {
    type: Number,
    default: 0
  },
  incMHP: {
    type: Number,
    default: 0
  },
  incMMD: {
    type: Number,
    default: 0
  },
  incMMP: {
    type: Number,
    default: 0
  },
  incPAD: {
    type: Number,
    default: 0
  },
  incPDD: {
    type: Number,
    default: 0
  },
  incRMAF: {
    type: Number,
    default: 0
  },
  incRMAI: {
    type: Number,
    default: 0
  },
  incRMAL: {
    type: Number,
    default: 0
  },
  incRMAS: {
    type: Number,
    default: 0
  },
  incSTR: {
    type: Number,
    default: 0
  },
  incSpeed: {
    type: Number,
    default: 0
  },
  incSwim: {
    type: Number,
    default: 0
  },
  islot: String,
  knockback: {
    type: Number,
    default: 0
  },
  longRange: {
    type: Number,
    default: 0
  },
  mpRecovery: {
    type: Number,
    default: 0
  },
  nameTag: {
    type: Number,
    default: 0
  },
  notSale: {
    type: Number,
    default: 0
  },
  only: {
    type: Number,
    default: 0
  },
  pachinko: {
    type: Number,
    default: 0
  },
  pickupItem: {
    type: Number,
    default: 0
  },
  pickupMeso: {
    type: Number,
    default: 0
  },
  pickupOthers: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  quest: {
    type: Number,
    default: 0
  },
  regPOP: {
    type: Number,
    default: 0
  },
  reqDEX: {
    type: Number,
    default: 0
  },
  reqINT: {
    type: Number,
    default: 0
  },
  reqJob: {
    type: Number,
    default: 0
  },
  reqLUK: {
    type: Number,
    default: 0
  },
  reqLevel: {
    type: Number,
    default: 0
  },
  reqPOP: {
    type: Number,
    default: 0
  },
  reqSTR: {
    type: Number,
    default: 0
  },
  sfx: {
    type: String,
    default: 0
  },
  slotMax: {
    type: Number,
    default: 0
  },
  stand: {
    type: Number,
    default: 0
  },
  sweepForDrop: {
    type: Number,
    default: 0
  },
  tamingMob: {
    type: Number,
    default: 0
  },
  timeLimited: {
    type: Number,
    default: 0
  },
  tradeBlock: {
    type: Number,
    default: 0
  },
  tuc: {
    type: Number,
    default: 0
  },
  vslot: String,
  walk: {
    type: Number,
    default: 0
  }
})

export default mongoose.model('ItemStats', itemStatSchema, 'itemStats')
