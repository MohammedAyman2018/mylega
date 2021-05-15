const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
// const cors = require('cors')

// Create express instance
const app = express()
// const corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

/** Connect to db */
async function db () {
  // process.env.DB_URL
  // mongodb://localhost:27017/test
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
};
db()

// app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const { Player } = require('./models/player')
const { Match } = require('./models/match')

app.get('/players', async (req, res) => {
  await Player.find({})
    .then(players => res.status(200).json(players))
    .catch(err => res.status(400).json({ msg: err }))
})

app.post('/players', async (req, res) => {
  await Player.create(req.body)
    .then(player => res.status(200).json(player))
    .catch(err => res.status(400).json({ msg: err }))
})

app.post('/players/match', async (req, res) => {
  const player1 = req.body.game[0]
  const player2 = req.body.game[1]

  const player1FromDb = await Player.findById(player1.id)
  const player2FromDb = await Player.findById(player2.id)

  await Match.create({ player1, player2 })

  player1FromDb.matches++
  player1FromDb.hisGoals += player1.goals
  player1FromDb.othersGoals += player2.goals

  player2FromDb.matches++
  player2FromDb.hisGoals += player2.goals
  player2FromDb.othersGoals += player1.goals

  if (player1.goals > player2.goals) { // player1 wins
    player1FromDb.win++
    player2FromDb.lose++
  } else if (player2.goals > player1.goals) { // player2 wins
    player2FromDb.win++
    player1FromDb.lose++
  } else if (player1.goals === player2.goals) { // draw
    player2FromDb.draw++
    player1FromDb.draw++
  }

  await Promise.all([
    player1FromDb.save(),
    player2FromDb.save()
  ])
    .then(player => res.status(200).json({ msg: 'done' }))
    .catch(err => res.status(400).json({ msg: err }))
})

app.get('/players/matches', async (req, res) => {
  await Match.find({})
    .then(players => res.status(200).json(players))
    .catch(err => res.status(400).json({ msg: err }))
})

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
