require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const path = require('path')

// Security
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require("express-mongo-sanitize")

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Routes
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

const app = express()

// MongoDB connexion
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))


// CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

// Express Middleware to parse JSON request
app.use(express.json())

// Headers security
app.use(helmet())
app.disable('x-powered-by')

// Limit number of request for same IP
app.use(apiLimiter)

// Prevent MongoDB from injection & Cross-Site scripting https://javascript.plainenglish.io/how-to-sanitize-your-express-app-against-mongodb-injection-cross-site-scripting-6a22f4e822aa
app.use(mongoSanitize())

// Routes
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes)
app.use('/api', sauceRoutes)

module.exports = app