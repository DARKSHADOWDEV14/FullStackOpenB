import express from 'express'
import cors from 'cors'
import Person from './models/person.js'


const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  const quantity = persons.length
  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${quantity} people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port http://localhost:${PORT}`)