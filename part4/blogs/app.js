import express from 'express'
import cors from 'cors'
import connectionString from './mongo.js'
import usersRouter from './controllers/users.js'
import blogsRouter from './controllers/blogs.js'
import { info } from './utils/logger.js'
import { requestLogger, unknownEndpoint, errorHandler } from './utils/middleware.js'



info('Connecting to MongoDB...')
connectionString()

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app