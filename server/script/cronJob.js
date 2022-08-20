const schedule = require('node-schedule');
const chalk = require("chalk")

const { sendMail } = require("./mail")
const { ticketFinder } = require("./ticket_puppeteer")
const { removeUserFromUserList } = require("../utils/user")
const { deleteUserFromDb } = require("../service/db")

const createJob = (from, to, date, userMail, activeUsers, amount, id) => {
    schedule.scheduleJob(id, "*/30 * * * * *", function () {
        console.log(chalk.cyan("Trenbileti aranan tarih => " + chalk.cyan.bold(date)))
        console.log(chalk.blue.bold("saat : " + chalk.bold(new Date().toLocaleString().split(" ")[1]) + ". kontrol ediliyor.\n"))

        ticketFinder(from, to, date, amount)
            .then(async (foundTickets) => {
                if (foundTickets?.length > 0) {
                    let mailText = "";

                    foundTickets.forEach(({ hourText }, _) => {
                        mailText += `${hourText} \n`
                    })

                    var mail = {
                        subject: "BİLET BULUNDU",
                        text: "\n\n" + date + ` tarihinde ${amount} adet bilet bulunmuştur.\nBiletlerin saatleri : \n${mailText}\n Tcdd bilet satın alma : "ebilet.tcddtasimacilik.gov.tr/view/eybis/tnmGenel/tcddWebContent.jsf"`
                    }

                    sendMail(userMail, mail)
                    try {
                        schedule.scheduledJobs[id].cancel()
                        removeUserFromUserList(activeUsers, userMail)
                        await deleteUserFromDb(id)

                        console.log("1 işlem sonlandırıldı. \nKalan işlem sayısı " + activeUsers.length)
                    } catch (error) {
                        console.log("cron job error ", error)
                    }
                }
            })
    });

}

const finishSingleJob = (id) => {
    schedule.scheduledJobs[id].cancel()
    console.log("Işlem başaryıla sonlandırıldı.")
}

const finishAllJobs = (activeUsers) => {
    activeUsers.emails = []
    console.log("Bütün işlemler başarıyla sonlandırıldı.")
    schedule.gracefulShutdown()
}

module.exports = { createJob, finishSingleJob, finishAllJobs }