require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const userRoutes = require('./routes/user')

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

// Routes
app.use('/api/auth', userRoutes)

module.exports = app