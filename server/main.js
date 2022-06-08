var express = require('express');
const { createJob } = require("./script/tcdd")

var app = express();

const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World');
})
app.post('/', (req, res) => {
    console.log('Tren Aranmaya Başlıyor')
    const { from, to, date, toMail } = req.body;
    createJob(from, to, date, toMail)
    res.send("post işlemi başarılı")
})


app.listen(PORT)
