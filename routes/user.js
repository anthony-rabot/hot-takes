const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')
const { userValidationRules, validate } = require('../middleware/user-validator.js')

// Define routes and Controller to use
router.post('/signup', userValidationRules(), validate, userController.createUser)
router.post('/login', userController.loginUser)

module.exports = router