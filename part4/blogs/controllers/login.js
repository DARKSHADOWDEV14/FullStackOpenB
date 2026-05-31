import jwt from 'jsonwebtoken'
import express from "express";
import bcrypt from 'bcrypt'
const loginRouter = express.Router()
import { SECRET } from '../utils/config.js'
import User from '../models/user.js'

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // el token expira in 60*60 segundos, eso es, en una hora
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )


  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

export default loginRouter