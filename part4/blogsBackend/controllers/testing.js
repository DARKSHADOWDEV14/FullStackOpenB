import express from 'express'
const testingRouter = express.Router()
import Blog from '../models/blog.js'
import User from '../models/user.js'

testingRouter.post('/reset', async (req, res) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  res.status(204).end()
})

export default testingRouter