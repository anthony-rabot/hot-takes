require('dotenv').config()
const Sauce = require('../models/sauce')
const jwt = require('jsonwebtoken')
const fs = require('fs')

// Create Sauce with form field, init values for likes and unlikes and manage image
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    delete sauceObject._userId
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })

    sauce.save()
        .then(() => { res.status(201).json({message: 'Sauce added'})})
        .catch(error => { res.status(400).json( { error })})
}

// Return all sauces
exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

// Return one sauce with id in request
exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

// Modify one sauce with id in request and manage image modification
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    delete sauceObject._userId
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({ message : "You aren't authorized to modify this sauce"})
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Sauce modified'}))
                    .catch(error => res.status(401).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

// Delete one sauce datas and image
exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({message: "You aren't authorized to modify this sauce"})
            } else {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce deleted'})})
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch( error => { res.status(500).json({ error })})
}

// Manage likes and unlikes values depends on sauce and user values
exports.likeSauce = (req, res, next) => {

    if (req.body.like === 1) { // Likes

        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if (!sauce.usersLiked.includes(req.auth.userId) ) {
                    Sauce.updateOne({ _id: req.params.id}, {
                        $inc: { likes: 1 },
                        $push: {usersLiked: req.auth.userId}
                    })
                        .then(() => res.status(200).json({ message: "Sauce liked" }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(400).json({ error }))
    } else if (req.body.like === -1) { // Dislikes

        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if (!sauce.usersDisliked.includes(req.auth.userId) ) {
                    Sauce.updateOne({ _id: req.params.id}, {
                        $inc: { dislikes: 1 },
                        $push: {usersDisliked: req.auth.userId}
                    })
                        .then(() => res.status(200).json({ message: "Sauce unliked" }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(400).json({ error }))
    } else { // req.body.likes et dislikes à 0
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.auth.userId) ) {
                    Sauce.updateOne({ _id: req.params.id}, {
                        $inc: { likes: -1 },
                        $pull: {usersLiked: req.auth.userId}
                    })
                        .then(() => res.status(200).json({ message: "User removed from liked users" }))
                        .catch((error) => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.auth.userId)) {
                    Sauce.updateOne({ _id: req.params.id}, {
                        $inc: { dislikes: -1 },
                        $pull: {usersDisliked: req.auth.userId}
                    })
                        .then(() => res.status(200).json({ message: "User removed from disliked users" }))
                        .catch((error) => res.status(400).json({ error }))

                }
            })
            .catch((error) => res.status(400).json({ error }))
    }
}