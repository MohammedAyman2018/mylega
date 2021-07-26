const { Router } = require('express')
const { Player } = require('../models/player')
const { Match } = require('../models/match')

const router = Router()

router.post('/matches', async (req, res) => {
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

router.get('/matches', async (req, res) => {
  await Match.find({})
    .then(players => res.status(200).json(players))
    .catch(err => res.status(400).json({ msg: err }))
})

router.put('/matches', async (req, res) => {
  const player1 = req.body.game[0]
  const player2 = req.body.game[1]

  const player1FromDb = await Player.findOne({ name: player1.name })
  const player2FromDb = await Player.findOne({ name: player2.name })

  const match = await Match.findById(req.body.matchId)

  // RESET RESULTS
  player1FromDb.hisGoals -= match.player1.goals
  player1FromDb.othersGoals -= match.player2.goals

  player2FromDb.hisGoals -= match.player2.goals
  player2FromDb.othersGoals -= match.player1.goals

  if (match.player1.goals > match.player2.goals) { // player1 wins
    player1FromDb.win--
    player2FromDb.lose--
  } else if (match.player2.goals > match.player1.goals) { // player2 wins
    player2FromDb.win--
    player1FromDb.lose--
  } else if (match.player1.goals === match.player2.goals) { // draw
    player2FromDb.draw--
    player1FromDb.draw--
  }

  // ADD CORRECT RESULTS
  player1FromDb.hisGoals += player1.goals
  player1FromDb.othersGoals += player2.goals

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
    Match.updateOne({ _id: req.body.matchId }, { player1, player2 }),
    player2FromDb.save()
  ])
    .then(player => res.status(200).json({ msg: 'done' }))
    .catch(err => res.status(400).json({ msg: err }))
})

router.post('/matches/delete', async (req, res) => {
  const player1 = req.body.game[0]
  const player2 = req.body.game[1]

  const player1FromDb = await Player.findOne({ name: player1.name })
  const player2FromDb = await Player.findOne({ name: player2.name })

  const match = await Match.findById(req.body.matchId)

  // RESET RESULTS
  player1FromDb.matches--
  player1FromDb.hisGoals -= match.player1.goals
  player1FromDb.othersGoals -= match.player2.goals

  player2FromDb.matches--
  player2FromDb.hisGoals -= match.player2.goals
  player2FromDb.othersGoals -= match.player1.goals

  if (match.player1.goals > match.player2.goals) { // player1 wins
    player1FromDb.win--
    player2FromDb.lose--
  } else if (match.player2.goals > match.player1.goals) { // player2 wins
    player2FromDb.win--
    player1FromDb.lose--
  } else if (match.player1.goals === match.player2.goals) { // draw
    player2FromDb.draw--
    player1FromDb.draw--
  }

  await Promise.all([
    player1FromDb.save(),
    player2FromDb.save(),
    match.delete()
  ])
    .then(player => res.status(200).json({ msg: 'done' }))
    .catch(err => res.status(400).json({ msg: err }))
})

module.exports = router
