var express = require('express');
var cors = require('cors')

const { createJob, finishAllJobs } = require("./script/tcdd")
const { sendMail } = require("./script/mail")

var app = express();

const PORT = process.env.PORT || 3001

var activeUsers = { emails: [] }

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
    res.send('Selam Dünyalı');
})
app.post('/', (req, res) => {
    const { from, to, date, toMail, amount } = req.body;

    if (activeUsers.emails.some((email) => email === toMail)) {
        console.log("bu mail ile zaten arama oluşturulmuş\n")
        return res.status(200).send({
            code: 0,
            text: "Zaten arama oluşturdunuz"
        })
    }
    else {
        activeUsers.emails.push(toMail)
        createJob(from, to, date, toMail, activeUsers, amount)
        sendMail(toMail, { subject: "BİLET BUL", text: `${date} TARİHİ İÇİN BİLET ARANIYOR. BULDUĞUM ZAMAN SİZE TEKRAR MAİL ATACAĞIM.` })

        console.log('Tren Aranmaya Başlıyor.')
        console.log("\n\n ", activeUsers, "\n\n")

        return res.status(200).send({
            code: 1,
            text: "Bilet aranmaya başlıyor."
        })
    }
})



app.post('/deleteAll', (req, res) => {
    res.send("tüm işlemler sonlandırıldı")
    finishAllJobs(activeUsers)
})

app.listen(PORT, () => {
    console.log(`Port ${PORT} dinleniyor.\nlocalhost : http://localhost:${PORT} \n `)
})
