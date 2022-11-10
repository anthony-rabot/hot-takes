const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceController = require('../controllers/sauce')

// Define routes and Controller to use
router.post('/sauces', auth, multer, sauceController.createSauce)
router.get('/sauces', auth, sauceController.getSauces)
router.get('/sauces/:id', auth, sauceController.getSauce)
router.put('/sauces/:id', auth, multer, sauceController.modifySauce)
router.delete('/sauces/:id', auth, sauceController.deleteSauce)

module.exports = router