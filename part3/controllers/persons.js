import express from 'express'
import Person from '../models/person.js'

const personsRouter = express.Router()

personsRouter.get('/', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
})

personsRouter.get('/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

personsRouter.post('/', (req, res, next) => {
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

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.put('/:id', (req, res, next) => {
  const { name, number } = req.body

  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(
    req.params.id,
    person,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

export default personsRouter