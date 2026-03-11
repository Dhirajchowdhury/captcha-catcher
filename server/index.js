require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const captchaRoutes = require('./routes/captcha')

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api', captchaRoutes)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err)
  })