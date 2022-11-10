const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceController = require('../controllers/sauce')

// Define routes and Controller to use
router.post('/sauces', auth, multer, sauceController.createSauce)

module.exports = router