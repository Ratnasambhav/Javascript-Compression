const mongoose = require('mongoose')
mongoose.promise = global.Promise
const slugs = require('slugs')

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Please enter a name or URL!'
  },
  algoName: {
    type: String,
    required: 'Please provide the name of the algorithm used'
  },
  compressed: {
    type: String,
    required: 'Please provide compressed data'
  },
  code: String
})

module.exports = mongoose.model('Data', dataSchema)
