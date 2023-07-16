const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})

app.use(express.json());
app.use(cors());
app.use(express.static('build'))
app.use(error);

app.get('/', (request, response) => {
    Note.find({}).then(notes =>
        response.json(notes)
    )
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    })
})

app.delete("/api/notes/:id", (request, response) => {
    Note.findByIdAndRemove(request.params.id).then(note => {
        response.status(204).end();
    }).catch(error => {
        next(error)
    })
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators:true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        }).catch(error => next(error))
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    note.save().then(savedNote => {
        response.json(savedNote);
    }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })

    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})