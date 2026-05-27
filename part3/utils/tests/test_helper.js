import User from '../../models/user.js'

 export const usersInDb = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}

