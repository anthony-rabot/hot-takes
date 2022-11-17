const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sauceValidationRules = require("../middleware/sauce-validator")

const sauceController = require('../controllers/sauce')




// Define routes and Controller to use
router.post('/sauces', auth, multer, sauceValidationRules, sauceController.createSauce)
router.get('/sauces', auth, sauceController.getSauces)
router.get('/sauces/:id', auth, sauceController.getSauce)
router.put('/sauces/:id', auth, multer, sauceController.modifySauce)
router.delete('/sauces/:id', auth, sauceController.deleteSauce)
router.post('/sauces/:id/like', auth, sauceController.likeSauce)

module.exports = router