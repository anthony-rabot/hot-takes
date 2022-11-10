const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')

// Define routes and Controller to use
router.post('/signup', userController.createUser)
router.post('/login', userController.loginUser)

module.exports = router