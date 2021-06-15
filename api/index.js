require('dotenv').config()
require('./mongo')

const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')
const userExtractor = require('./middleware/userExtractor')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const User = require('./models/User')

const app = express()
app.use(express.json())

app.use(cors())
app.use(logger)
app.use(express.static('../app/build'))

app.get('/api/notes', async (request, response) => {
    const notes = await Note.find({}).populate('user', {
        username: 1,
        name: 1
    })
    response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
    const { id } = request.params
    Note.findById(id)
        .then(note => {
            if (note) {
                return response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(err => {
            next(err)
        })
})

app.delete('/api/notes/:id', userExtractor, (request, response, next) => {
    const { id } = request.params
    Note.findByIdAndRemove(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', userExtractor, (request, response, next) => {
    const { id } = request.params

    const note = request.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }

    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
        .then(result => {
            response.json(result)
        })
        .catch(err => next(err))
})

app.post('/api/notes', userExtractor, async (request, response, next) => {
    const { content, important = false } = request.body
    const { userId } = request
    const user = await User.findById(userId)

    if (!content) {
        return response.status(400).json({
            error: 'Content is missing.'
        })
    }

    const newNote = new Note({
        content,
        important,
        date: new Date(),
        user: user._id
    })

    try {
        const savedNote = await newNote.save()
        user.notes = user.notes.concat(savedNote._id)
        await user.save()
        response.json(savedNote)
    } catch (error) {
        next(error)
    }
})

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(handleError)
app.use(notFound)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
