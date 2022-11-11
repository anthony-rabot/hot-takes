const mongoose = require('mongoose')
const mongooseErrors = require('mongoose-errors')

// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
const Schema = mongoose.Schema

const sauceSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false },
    usersLiked: { type: Array, required: false },
    usersDisliked: { type: Array, required: false }
});

sauceSchema.plugin(mongooseErrors)

module.exports = mongoose.model('Sauce', sauceSchema)