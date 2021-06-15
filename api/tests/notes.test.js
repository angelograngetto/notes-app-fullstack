const mongoose = require('mongoose')
const supertest = require('supertest')
const {app,server} = require('../index')

const api = supertest(app)
const Note = require('../models/Note')

const initialNotes = [
    {
        content: 'Aprendiendo Fullstack con midudev',
        important: true,
        date: new Date()
    },
    {
        content: 'Sigueme en midu',
        important: true,
        date: new Date()
    }
]

beforeEach(async()=>{
    await Note.deleteMany({})

    const note1 = new Note(initialNotes[0])
    await note1.save()
    const note2 = new Note(initialNotes[1])
    await note2.save()
})

test('notes are returned as json', async ()=>{
    await api
        .get('/api/notes')
        .expect(200)
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
})

test('the first is about midudev', async() => {
    const response = await api.get('/api/notes')
    expect(response.body[0].content).toBe('Aprendiendo Fullstack con midudev')
})

test('a valid note can be added', async ()=>{
    const newNote = {
        content : 'Proximamente async/await',
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)

    const response = await api.get('/api/notes/')
    const contents = response.body.map(note => note.content)
    expect(response.body).toHaveLength(initialNotes.length+1)
    expect(contents).toContain(newNote.content)
})

afterAll(()=>{
    mongoose.connection.close()
    server.close()
})