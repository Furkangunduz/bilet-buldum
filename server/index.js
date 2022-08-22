const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto')

const { createJob, finishAllJobs, finishSingleJob } = require('./script/cronJob');
const { removeUserFromUserList, logActiveUsers } = require("./utils/user")
const { sendMail } = require('./script/mail');
const { saveUserToDb, getAllUsersFromDb, deleteUserFromDb, deleteUserListFromDb } = require("./service/db")
const { respondText } = require("./const_respond_texts")

const PORT = process.env.PORT || 3002;
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.listen(PORT, () => {
    console.log(`PORT:${PORT} dinleniyor.\n`);
});


app.get('/', (req, res) => {
    res.send('hello');
});

let activeUsers = []

getAllUsersFromDb().then(
    (response) => {
        activeUsers = response
        if (activeUsers !== undefined) {
            activeUsers.forEach(({ from, to, date, mail, amount, id }) => {
                createJob(from, to, date, mail, activeUsers, amount, id);
            })
            logActiveUsers(activeUsers)
        }
    }
)

app.post('/', async (req, res) => {
    const { from, to, date, mail, amount } = req.body;
    const id = randomUUID()

    if (activeUsers.forEach((user) => user.mail === mail)) {
        console.log(`${mail} ile zaten arama oluşturulmuş\n`);
        return res.status(200).send({
            code: 0,
            text: respondText[0],
        });
    }
    if (activeUsers.length >= 2) {
        console.log(mail, "Daha fazla arama yapılamıyor.")
        return res.status(200).send({
            code: 4,
            text: respondText[4]
        });
    }

    activeUsers.push({ mail, from, to, amount, date, id });
    logActiveUsers(activeUsers)
    createJob(from, to, date, mail, activeUsers, amount, id);
    await saveUserToDb(mail, from, to, amount, date, id)

    sendMail(mail, {
        subject: 'BİLET ARAMAYA BAŞLADIM',
        text: `\n${date} tarihi için ${amount} adet bilet aramaya başladım.\n Bilet bulduğumda haber vereceğim.`,
    });

    return res.status(200).send({
        code: 1,
        text: respondText[1],
    });
});

app.post('/finishSingleJob', async (req, res) => {
    const mail = req.body.mail

    let id = removeUserFromUserList(activeUsers, mail)
    if (id !== undefined) {
        finishSingleJob(id)
        await deleteUserFromDb(id)
        return res.status(200).send({
            code: 2,
            text: respondText[2],
        });
    } else {
        return res.status(200).send({
            code: 3,
            text: respondText[3],
        });
    }
});
