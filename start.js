const mongoose = require('mongoose')

// Make sure that we are runnig on Node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat)
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log(`Installed Node version: ${process.version.node}`)
  console.log('Atleast Node version 7.6 is required. Please go to nodejs.org and download version 7.6 or greater.')
  process.exit()
}

// Import all configurationa & enviornamental variables form variables.env
require('dotenv').config({ path: 'variables.env' })

// Connect with database and handel bad connencitons!
mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise
mongoose.connection.on('error', err => {
  console.log(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
  process.exit()
})

// Import all our mongoose models
require('./models/Data')

// Start our app!
const app = require('./app')
app.set('port', process.env.PORT || 7778)
const server = app.listen(app.get('port'), () => {
  console.log(`Express server running on PORT ${server.address().port}`)
})
