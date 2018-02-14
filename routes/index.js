const express = require('express')
const { catchErrors } = require('../handlers/errorHandlers')
const dataController = require('../controllers/dataController')
const scraper = require('../controllers/scraper')
const router = express.Router()

router.get('/', (req, res) => res.render('home'))
router.post('/url', catchErrors(scraper.scrape))
router.post('/text', catchErrors(dataController.getStats))
router.post('/save', catchErrors(dataController.save))
router.get('/saved', catchErrors(dataController.getSaved))
router.get('/results/:id', catchErrors(dataController.retrive))

module.exports = router
