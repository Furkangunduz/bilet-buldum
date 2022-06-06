const cron = require("node-cron");
const chalk = require("chalk")

const { fetchTCDD } = require("./script/tcdd");

cron.schedule("*/15 * * * * *", function () {
    fetchTCDD();
    console.log(chalk.blue.bold(new Date().toLocaleString().split(" ")[1] + " anında kontrol ediliyor. "))
    console.log(chalk.green("Trenbileti aranan tarih =>" + date))
});