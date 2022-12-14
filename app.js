const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)
app.use('/', loginRouter)
app.use('/', blogsRouter) // app.use('/api/blogs', blogsRouter), this is entry point of router ! otherwise need /api/blogs/api/blogs when doing API
app.use('/', usersRouter) // app.use('/api/blogs', blogsRouter), this is entry point of router ! otherwise need /api/blogs/api/blogs when doing API


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app