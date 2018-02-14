const request = require('request')
const cheerio = require('cheerio')
const { catchErrors } = require('../handlers/errorHandlers')
const dataController = require('./dataController')

exports.scrape = async (req, res) => {
  await request(req.body.url, function (err, resp, html) {
    console.log(req.body.url)
    if (!err) {
      console.log('Here')
      const $ = cheerio.load(html)
      console.log(html)
      // catchErrors(dataController.getStats)
      res.json(html)
      return
    }
    console.log(err)
    res.send(err)
  })
}
