const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const mongooseErrors = require('mongoose-errors')

// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

userSchema.plugin(mongooseErrors)
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)