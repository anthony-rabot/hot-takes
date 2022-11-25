require('dotenv').config()
const mongoose = require('mongoose')
const mongooseConnexion = require("./config/db");
const express = require('express')
const path = require('path')

// Security packages
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require("express-mongo-sanitize")
const hpp = require('hpp')

// MongoDB connexion
mongooseConnexion(process.env.MONGODB_URL)

// Routes
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

const app = express()

// Express Middleware to parse JSON request
app.use(express.json())

// Security

// Helmet add some security defaults headers https://stackoverflow.com/questions/70752770/helmet-express-err-blocked-by-response-notsameorigin-200
app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
)
app.disable('x-powered-by')

// Limit number of request for same IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(apiLimiter)

// Prevent MongoDB from injection & Cross-Site scripting https://javascript.plainenglish.io/how-to-sanitize-your-express-app-against-mongodb-injection-cross-site-scripting-6a22f4e822aa
app.use(mongoSanitize())

// HPP protect against HTTP Parameter Pollution attacks
app.use(hpp())

// CORS
app.use(cors({
    "origin": "*",
    "allowedHeaders": "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
    "methods": "GET, PUT, POST, DELETE"
}));

// Routes
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes)
app.use('/api', sauceRoutes)

module.exports = app