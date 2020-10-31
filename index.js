const express = require('express')
const jimp = require('jimp')

const app = express()
const port = process.env.PORT || 3000

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

app.get('/i/:name/:days/:record', async (req, res) => {
    const ROBOTO_REGULAR_96 = await jimp.loadFont('./res/roboto/roboto-regular-96.fnt')
    const ROBOTO_REGULAR_72 = await jimp.loadFont('./res/roboto/roboto-regular-72.fnt')
    const ROBOTO_BOLD_72 = await jimp.loadFont('./res/roboto/roboto-bold-72.fnt')

    jimp.read('./res/base.png')
        .then(base => {
            return base
            .print(ROBOTO_REGULAR_96, 614, 80, req.params.name)
            .print(ROBOTO_REGULAR_72, 610, 180, "está há")
            .print(ROBOTO_BOLD_72, 870, 180, `${req.params.days} dias`)
            .print(ROBOTO_REGULAR_72, 610, 250, "sem tiltar")
            .print(ROBOTO_REGULAR_72, 610, 350, "O recorde é de")
            .print(ROBOTO_BOLD_72, 610, 420, `${req.params.record} dias`)
            .getBuffer('image/png', (err, buff) => {
                res.set('content-type', 'image/png')
                res.send(buff)
            })
        })
        .catch(err => {
            console.log(err)
        })
})

app.listen(port, () => {
    console.log(`Tiltado está rodando em http://localhost:${port}`)
})
