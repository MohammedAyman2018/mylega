const { Router } = require('express')
const { Player } = require('../models/player')
const router = Router()

router.get('/players', async (req, res) => {
  await Player.find({})
    .then(players => res.status(200).json(players))
    .catch(err => res.status(400).json({ msg: err }))
})

router.post('/players', async (req, res) => {
  await Player.create(req.body)
    .then(player => res.status(200).json(player))
    .catch(err => res.status(400).json({ msg: err }))
})

module.exports = router
