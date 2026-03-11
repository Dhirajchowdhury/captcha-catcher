const express = require('express')
const router = express.Router()
const { solve } = require('../controllers/captchaController')

router.post('/solve', solve)

module.exports = router
