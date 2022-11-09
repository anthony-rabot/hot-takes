require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res) => {
    res.json({message: 'Votre requête a bien été très bien reçue !'});
})

module.exports = app;