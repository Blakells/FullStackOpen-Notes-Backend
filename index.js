require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

// middleware
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  }
  next(err)
}
app.use(errorHandler)

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint)
/////////////////////////////////////////////////////////////////

// landing page
app.get('/', (req, res) => {
  res.send('<h1>Hello world!!</h1>')
})

// get all notes within the DB
app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes.map(note => note.toJSON()))
  })
})

// get a single note by ID
app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.json(note.toJSON())
    } else {
      res.status(404).end()
    }
  })
  .catch(err => {
    next(err)
  })
})

// delete a single note by ID
app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
  .then(res => {
    console.log('note removed successfully')
    res.status(204).end()
  })
  .catch(err => next(err))
})

//update note importance
app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body
  const note = {
    content: body.content,
    important : body.important
  }

  Note.findByIdAndUpdate(req.params.id, note, {new : true})
  .then(updatedNote => {
    res.json(updatedNote.toJSON())
  })
  .catch(err => next(err))
})

// add new notes to the server
app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  note.save().then(savedNote => {
    res.json(savedNote.toJSON())
    console.log(savedNote.content)
  })
})


//PORT configuration
const PORT = process.env.PORT
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})