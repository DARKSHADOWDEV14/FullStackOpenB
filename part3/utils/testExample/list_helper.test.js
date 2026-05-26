import { test, describe } from 'node:test'
import { strictEqual, deepStrictEqual } from 'node:assert'
import { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } from './list_helper.js'
import { initialBlogs } from './test_helper.js'


test('dummy returns one', () => {
  const blogs = []

   const result = dummy(blogs)
   strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '1',
      title: 'First blog',
      author: 'Andres',
      url: 'https://example.com',
      likes: 5,
    },
  ]

  const listWithManyBlogs = [
    {
      _id: '1',
      title: 'First blog',
      author: 'Andres',
      url: 'https://example.com/1',
      likes: 5,
    },
    {
      _id: '2',
      title: 'Second blog',
      author: 'Maria',
      url: 'https://example.com/2',
      likes: 10,
    },
    {
      _id: '3',
      title: 'Third blog',
      author: 'Juan',
      url: 'https://example.com/3',
      likes: 7,
    },
  ]

  test('of empty list is zero', () => {
    const result = totalLikes([])

    strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)

    strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(listWithManyBlogs)

    strictEqual(result, 22)
  })
})

describe('favorite blog', () => {
  test('returns blog with most likes', () => {
    const result = favoriteBlog(initialBlogs)

    deepStrictEqual(result, {
      title: 'Second blog',
      author: 'Maria',
      url: 'https://example.com/2',
      likes: 10,
    })
  })
})

describe('most blogs', () => {
  test('author with most blogs is returned', () => {
    const result = mostBlogs(initialBlogs)

    deepStrictEqual(result, {
      author: 'Andres',
      blogs: 2,
    })
  })
})

describe('most likes', () => {
  test('author with most likes is returned', () => {
    const result = mostLikes(initialBlogs)

    deepStrictEqual(result, {
      author: 'Andres',
      likes: 12,
    })
  })
})