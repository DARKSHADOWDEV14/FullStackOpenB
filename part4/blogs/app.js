import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import connectionString from './mongo.js'
import usersRouter from './controllers/users.js'
import blogsRouter from './controllers/blogs.js'


connectionString()

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

export default app