import mongoose from 'mongoose'
import 'dotenv/config'


const url = process.env.MONGODB_URI


mongoose.connect(url)
.then(() => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})



const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


// Person.find({}).then(result => {
//   result.forEach(person => {
//     console.log(person)
//   })
//   mongoose.connection.close()
// })
// const person = new Person({
//   name: 'John Doee',
//   number: '123-456-7890003',
// })

// person.save()
//    .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(error => {
//     console.log('error saving person:', error.message)
//     mongoose.connection.close()
//   })

