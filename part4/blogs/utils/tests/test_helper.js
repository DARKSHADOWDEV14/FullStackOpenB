import Blog from '../../models/blog.js'

export const initialBlogs = [
  {
    title: 'First blog',
    author: 'Andres',
    url: 'https://example.com',
    likes: 5,
  },
   {
    title: 'Second blog',
    author: 'David',
    url: 'https://example2.com',
    likes: 10,
  },
   {
    title: 'Third blog',
    author: 'Juan',
    url: 'https://example3.com',
    likes: 15,
  }
]

export const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

export const nonExistingId = async () => {
  const blog = new Blog({ title: 'my first blog' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}