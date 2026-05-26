import { beforeEach, test, after } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Person from '../../models/person.js'


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

after(async () => {
  await mongoose.connection.close()
})