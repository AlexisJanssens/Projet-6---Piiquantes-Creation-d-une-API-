// imports
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

// model for user
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// plugin for unique mail 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);