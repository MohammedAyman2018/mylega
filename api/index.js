const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')

// Create express instance
const app = express()
const corsOptions = {
  origin: 'https://league-two.vercel.app/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

/** Connect to db */
async function db () {
  // process.env.DB_URL
  // mongodb://localhost:27017/league
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
};
db()

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const playersRoute = require('./routes/players')
const matchesRoute = require('./routes/matches')
const leaguesRoute = require('./routes/leagues')
app.use(playersRoute)
app.use(matchesRoute)
app.use(leaguesRoute)

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
