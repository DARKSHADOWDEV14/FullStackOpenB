import { beforeEach, test, after, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Person from '../../models/person.js'
import bcrypt from 'bcrypt'
import User from '../../models/user.js'
import { usersInDb } from './test_helper.js'

const api = supertest(app)

const initialPersons = [
  {
    name: 'Andres',
    number: '12345678',
  },
  {
    name: 'Maria',
    number: '87654321',
  },
]

beforeEach(async () => {
  await Person.deleteMany({})

  for (const person of initialPersons) {
    const personObject = new Person(person)
    await personObject.save()
  }
})

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})



test('there are two persons', async () => {
  const response = await api.get('/api/persons')

  assert.strictEqual(response.body.length, 2)
})

test('the first person is Andres', async () => {
  const response = await api
    .get('/api/persons')

  const names = response.body.map(person => person.name)

  assert(names.includes('Andres'))
})

test('person unique identifier property is named id', async () => {
  const response = await api
    .get('/api/persons')

  const person = response.body[0]

  assert(person.id !== undefined)
})

test('a valid person can be added', async () => {
  const newPerson = {
    name: 'John Doe',
    number: '555-1234',
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/persons')

  const persons = response.body

  assert.strictEqual(persons.length, initialPersons.length + 1)

  const names = persons.map(person => person.name)

  assert(names.includes('John Doe'))

})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with short username', async () => {
  const newUser = {
    username: 'ab',
    name: 'Andres',
    password: 'secret',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(
    response.body.error.includes('shorter than the minimum')
  )
})

test('creation fails with invalid username', async () => {
  const newUser = {
    username: 'andres@@',
    name: 'Andres',
    password: 'secret',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(
    response.body.error.includes('Path `username` is invalid')
  )
})

test.only('creation fails with short password', async () => {
  const newUser = {
    username: 'andres',
    name: 'Andres',
    password: '12',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(
    response.body.error.includes(
      'password must be at least 3 characters long'
    )
  )
})
})

after(async () => {
  await mongoose.connection.close()
})