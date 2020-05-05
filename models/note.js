const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI

console.log('connecting to...', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(res => {
    console.log('connected to mongoDB')
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})
//format schema correctly
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)