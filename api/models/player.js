const mongoose = require('mongoose')

const user = new mongoose.Schema({
  name: String,
  matches: {
    type: Number,
    default: 0
  },
  win: {
    type: Number,
    default: 0
  },
  lose: {
    type: Number,
    default: 0
  },
  draw: {
    type: Number,
    default: 0
  },
  hisGoals: {
    type: Number,
    default: 0
  },
  othersGoals: {
    type: Number,
    default: 0
  }
})

exports.Player = mongoose.model('users', user)
