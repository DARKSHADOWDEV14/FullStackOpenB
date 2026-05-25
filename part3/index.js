import express from 'express'
import cors from 'cors'
import Person from './models/person.js'
import connectionString from "./mongo.js"
import middleware from './utils/middleware.js'

connectionString();

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.requestLogger)


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', async (req, res) => {
  const quantity = await Person.countDocuments({})
  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${quantity} people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})


app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end("Not found persons with id " + req.params.id)
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({
    error: 'name or number missing'
  })
  }



  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(
    request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})