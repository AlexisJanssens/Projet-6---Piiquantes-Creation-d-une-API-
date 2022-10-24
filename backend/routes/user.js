// imports
const express = require('express')
const router = express.Router();

const userCtrl = require('../controllers/user');

// roads of API
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router