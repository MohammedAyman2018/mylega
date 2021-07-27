const { Router } = require('express')
const { League } = require('../models/leagues')
const router = Router()

/**
 * @argument { Stirng } name league name
 * @argument { Stirng } password league password
 */
router.post('/leagues/login', async (req, res) => {
  const league = await League.findOne(req.body)
    .populate('matches')
    .populate('players')
    .populate('winner')
    .select('password-')

  if (league) {
    return res.status(200).json(league)
  } else {
    return res.status(400).json({ msg: 'برجاء التأكد من البيانات' })
  }
})

/**
 * @argument { Stirng } name league name
 * @argument { Stirng } password league password
 */
router.post('/leagues/new', async (req, res) => {
  await League.create(req.body)
    .then(league => res.status(200).json(league))
    .catch(err => res.status(400).json({ msg: err }))
})

/**
 * @argument { Stirng } name league name
 * @argument { Stirng } password league password
 */
router.post('/leagues/end', async (req, res) => {
  try {
    const league = await League.findById(req.body.leagueId)
    league.winner = req.body.playerId
    await league.save()
    return res.status(200).json(league)
  } catch (err) {
    return res.status(400).json({ msg: err })
  }
})

/**
 * @argument { Stirng } name league name
 * @argument { Stirng } password league password
 */
router.get('/leagues/update/:id', async (req, res) => {
  await League.findById(req.params.id)
    .populate('matches')
    .populate('players')
    .populate('winner')
    .then(league => res.status(200).json(league))
    .catch(err => res.status(400).json({ msg: err }))
})

module.exports = router
