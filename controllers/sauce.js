require('dotenv').config()
const Sauce = require('../models/sauce')
const jwt = require('jsonwebtoken')

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
        .catch(error => { res.status(400).json( { error })})
};