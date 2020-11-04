const express = require('express')
const jimp = require('jimp')

const app = express()
const port = process.env.PORT || 3000

// Datasource connection call
require("./data/db")();
const Tiltados = require("./data/Tiltado")
app.locals.env = process.env

app.use(express.static('public'))

app.set('views', './src/views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/:name/:days/:record', (req, res) => {
    const {name, days, record} = req.params

    res.render('internal', {
        name,
        days,
        record
    })
})

app.get('/i/:name/:days/:record', async (req, res) => {
    renderLastTilt(res, req.params.name, req.params.days, req.params.record);
})

app.get('/automated/source/:name/aspira', (req, res) => {
    const {name} = req.params
    const lastTilt = new Date().getTime();
    const record = 0;
    
    new Tiltados({name, lastTilt, record}).save().then(result => {
        res.send(result.id);
    }).catch(error => {
        console.error(error);
        res.send("Error saving the user")
    })
})

app.get('/automated/source/geral/lista', (req, res) => {
    Tiltados.find().then(result => {
        res.send(result);
    })
})

app.get('/automated/source/:id/tiltou', (req, res) => {
    const {id} = req.params
    const lastTilt = new Date().getTime();
    
    Tiltados.findById(id).then(savedTiltado => {
        let record = 0;
        if (savedTiltado) {
            const daysDiff = daysDifference(lastTilt, savedTiltado.lastTilt)
            if (daysDiff > record) {
                savedTiltado.record = daysDiff;
            }
            savedTiltado.lastTilt = lastTilt;
            new Tiltados(savedTiltado).save();
            renderLastTilt(res, savedTiltado.name, daysDiff, savedTiltado.record < daysDiff ? daysDiff : savedTiltado.record);
        } else {
            new Tiltados({name, lastTilt, record}).save();
            renderLastTilt(res, name, 0, 0);
        }
    })
    
})

app.get('/automated/source/:id/comoEsta', (req, res) => {
    const {id} = req.params
    const lastTilt = new Date().getTime();
    
    Tiltados.findById(id).then(savedTiltado => {
        let record = 0;
        if (savedTiltado) {
            const daysDiff = daysDifference(new Date().getTime(), savedTiltado.lastTilt);
            if (daysDiff > record) {
                savedTiltado.record = daysDiff;
            }
            renderLastTilt(res, savedTiltado.name, daysDiff, savedTiltado.record < daysDiff ? daysDiff : savedTiltado.record);
        } else {
            res.send("usuário Inválido")
        }
    })
    
})

async function renderLastTilt(res, name, days, record) {
    const ROBOTO_REGULAR_96 = await jimp.loadFont('./res/roboto/roboto-regular-96.fnt')
    const ROBOTO_REGULAR_72 = await jimp.loadFont('./res/roboto/roboto-regular-72.fnt')
    const ROBOTO_BOLD_72 = await jimp.loadFont('./res/roboto/roboto-bold-72.fnt')

    jimp.read('./res/base.png')
        .then(base => {
            return base
            .print(ROBOTO_REGULAR_96, 614, 80, name)
            .print(ROBOTO_REGULAR_72, 610, 180, "está há")
            .print(ROBOTO_BOLD_72, 870, 180, `${days} dias`)
            .print(ROBOTO_REGULAR_72, 610, 250, "sem tiltar")
            .print(ROBOTO_REGULAR_72, 610, 350, "O recorde é de")
            .print(ROBOTO_BOLD_72, 610, 420, `${record} dias`)
            .getBuffer('image/png', (err, buff) => {
                res.set('content-type', 'image/png')
                res.send(buff)
            })
        })
        .catch(err => {
            console.log(err)
        })
}

function daysDifference(firstDate, secondDate) {
    const timeDiff = Math.abs(secondDate - firstDate);
    return Math.floor(timeDiff / (1000 * 3600 * 24));
}
app.listen(port, () => {
    console.log(`Tiltado está rodando em http://localhost:${port}`)
})
