import mongoose, { Schema } from 'mongoose'

let mapPortalSchema = Schema({
  id: Number,
  map: Number,
  label: String,
  x: Number,
  y: Number,
  destination: Number,
  destinationLabel: String,
  script: String,
  onlyOnce: Boolean,
})

mapPortalSchema.index({map: 1, id: 1}, { unique: true })

export default mongoose.model('MapPortal', mapPortalSchema, 'mapPortals')
