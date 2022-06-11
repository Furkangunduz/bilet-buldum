var express = require('express');
var cors = require('cors')
const { createJob, finishAllJobs } = require("./script/tcdd")

var app = express();

const PORT = process.env.PORT || 3001


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
    res.send('Selam Dünyalı');
})
app.post('/', (req, res) => {
    console.log('Tren Aranmaya Başlıyor.')
    const { from, to, date, toMail } = req.body;
    createJob(from, to, date, toMail)
    res.send("Bilet aramaya başlandı.")
})

app.post('/deleteAll', (req, res) => {
    res.send("tüm işlemler sonlandırıldı")
    finishAllJobs()
})

app.listen(PORT, () => {
    console.log(`Port ${PORT} dinleniyor.\nlocalhost : http://localhost:${PORT} \n `)
})
