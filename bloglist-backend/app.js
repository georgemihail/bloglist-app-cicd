//const http = require('http')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const testingRouter = require('./controllers/testing')



app.use(cors())
app.use(express.json())

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(express.static('build'))
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', postsRouter)
app.use('/api/testing', testingRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
