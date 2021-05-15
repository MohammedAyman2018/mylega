const mongoose = require('mongoose')

const match = new mongoose.Schema({
  player1: {
    name: String,
    goals: Number
  },
  player2: {
    name: String,
    goals: Number
  }
},
{ timestamps: true })

exports.Match = mongoose.model('matches', match)
