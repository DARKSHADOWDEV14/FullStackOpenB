import blogsRouter from './controllers/blogs.js'
import express from 'express'
import cors from 'cors'
import Blog from './models/blog.js'
import mongoose from 'mongoose'
import connectionString from './mongo.js'

connectionString()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

export default app