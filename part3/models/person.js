import mongoose from 'mongoose'

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 2, required: true },
  number: { type: String, minlength: 5, required: true },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

export default Person