import express from 'express'
import Blog from '../models/blog.js'
const blogsRouter = express.Router()    

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1,
    })
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.title || !body.url) {
    return res.status(400).json({
      error: 'title or url missing',
    })
  }

  const blog = new Blog(body)

  const savedBlog = await blog.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body

    const blog = {
      title,
      author,
      url,
      likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      blog,
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    )

    res.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

export default blogsRouter