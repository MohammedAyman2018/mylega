const { Router } = require('express')
const { League } = require('../models/leagues')
const { Player } = require('../models/player')
const router = Router()

router.get('/players', async (req, res) => {
  await Player.find({})
    .then(players => res.status(200).json(players))
    .catch(err => res.status(400).json({ msg: err }))
})

router.post('/players', async (req, res) => {
  const { name, leagueId } = req.body
  await Player.create({ name })
    .then(async (player) => {
      const league = await League.findOne({ _id: leagueId })
      league.players.push(player._id)
      await league.save()
      return res.status(200).json(player)
    })
    .catch(err => res.status(400).json({ msg: err }))
})

module.exports = router
