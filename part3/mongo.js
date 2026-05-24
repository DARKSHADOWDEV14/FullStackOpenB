import mongoose from "mongoose";
import "dotenv/config";

const connectionString = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to MongoDB')
  } catch (error) {
    console.log('error connecting to MongoDB:', error.message)
  }
}

export default connectionString

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
