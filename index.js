const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.set('views', './src/views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/:name/:days/:record', (req, res) => {
    res.render('internal', {
        name: req.params.name,
        days: req.params.days,
        record: req.params.record
    })
})

app.get('/i/{name}/{days}/{record}', (req, res) => {
    res.send('image goes here')
})

app.listen(port, () => {
    console.log(`Tiltado está rodando em http://localhost:${port}`)
})
