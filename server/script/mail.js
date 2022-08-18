require('dotenv').config()

const chalk = require("chalk")
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    }
});

const sendMail = (to, { subject, text }) => {
    var mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Mail Gönderirken bir sorunla karşılaşıldı\n", error, "\n");
        else console.log(chalk.bgBlack.white('Mail başarıyla gönderildi\n'));
    });
}

module.exports = { sendMail }