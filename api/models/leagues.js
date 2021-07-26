const mongoose = require('mongoose')

const league = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  matches: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'matches' }],
    default: [],
    required: true
  },
  players: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    default: [],
    required: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
},
{ timestamps: true })

exports.League = mongoose.model('leagues', league)
