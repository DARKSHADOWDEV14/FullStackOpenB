import { beforeEach, test, after, describe } from 'node:test'
import supertest from 'supertest'
import assert from 'node:assert'
import mongoose from 'mongoose'
import app from '../../app.js'
import Blog from '../../models/blog.js'

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Andres',
    url: 'https://example.com',
    likes: 5,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  await new Blog({
    title: 'First blog',
    author: 'Andres',
    url: 'https://example.com',
    likes: 5,
  }).save()
})



test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs have a unique identifier named id', async () => {
  const response = await api
    .get('/api/blogs')
  const blog = response.body[0]

  assert(blog.id !== undefined)
  assert.strictEqual(blog._id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Second blog',
    author: 'Jane Doe',
    url: 'https://example.com/second',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const blogs = response.body

  assert.strictEqual(blogs.length, initialBlogs.length + 1)

  const titles = blogs.map(blog => blog.title)

  assert(titles.includes('Second blog'))

})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Andres',
    url: 'https://example.com',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Andres',
    url: 'https://example.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Missing URL',
    author: 'Andres',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

describe('deletion of a blog', () => {
 test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')

  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    initialBlogs.length - 1
  )

  const titles = blogsAtEnd.body.map(blog => blog.title)

  assert(!titles.includes(blogToDelete.title))
})
})

describe.only('updating a blog', () => {
test('a blog can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')

  const blogToUpdate = blogsAtStart.body[0]

  const updatedData = {
    ...blogToUpdate,
    likes: 100,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 100)
})
})

after(async () => {
  await mongoose.connection.close()
})
