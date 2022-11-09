const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:49154', {
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