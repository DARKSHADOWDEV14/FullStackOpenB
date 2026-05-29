import { hash } from 'bcrypt'
import User from '../models/user.js'
import express from 'express'


const usersRouter = express.Router()

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('persons', {
      name: 1,
      number: 1,
    });
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

   if (password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long',
    })
  }

  const saltRounds = 10
  const passwordHash = await hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

export default usersRouter