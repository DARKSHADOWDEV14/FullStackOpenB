import User from '../../models/user.js'
import Person from '../../models/person.js'

 export const usersInDb = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}

export const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map(person => person.toJSON())
}

