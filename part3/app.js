import express from 'express'
import cors from 'cors'

import connectionString from "./mongo.js"
import { requestLogger, unknownEndpoint, errorHandler} from './utils/middleware.js'
import personsRouter from './controllers/persons.js'
import usersRouter from './controllers/users.js'

connectionString();

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(requestLogger)


app.use('/api/persons', personsRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app