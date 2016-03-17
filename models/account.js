import mongoose, { Schema } from 'mongoose'

let accountSchema = Schema({
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

accountSchema.methods.getIntID = function getIntID() {
  return parseInt(this._id.toString().substr(0, 8), 16)
}

export default mongoose.model('Account', accountSchema)
