const puppeteer = require("puppeteer");
const chalk = require("chalk")
const schedule = require("node-schedule")

const { randomUUID } = require('crypto')
const { sendMail } = require("./mail")

const URL =
    "https://ebilet.tcddtasimacilik.gov.tr/view/eybis/tnmGenel/tcddWebContent.jsf";

const allParanthesesRgx = /\([^()]+\)/g
const lastParanthesesRgx = /.*\(([^)]+)\)/
const log = console.log

var wagons = []
var foundTickets = []

//function returns 1 when it find ticket 
//otherwise return 0
async function fetchTCDD(from, to, date, amount) {
    try {

        const browser = await puppeteer.launch({
            headless: true,
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.goto(URL);

        // set "From"
        await page.type("#nereden", from);
        await page.waitForTimeout(400);
        await page.click("body > ul:nth-child(5) > li > a");
        await page.waitForTimeout(250);

        // set "To"
        await page.type("#nereye", to);
        await page.waitForTimeout(400);
        await page.click("body > ul:nth-child(6) > li > a");
        await page.waitForTimeout(250);

        // set "Date"
        await page.$eval("#trCalGid_input", (el) => (el.value = ""));
        await page.waitForTimeout(250);
        await page.type("#trCalGid_input", date);

        await page.waitForTimeout(750);

        //Click search button
        await page.click("#btnSeferSorgula");
        await page.waitForNavigation();


        try {
            await page.waitForTimeout(1500);
            wagons = []
            foundTickets = []
            let index = 1;

            while (true) {
                let wagon = await page.$x(`/html/body/div[3]/div[2]/div/div/div/div/form/div[1]/div/div[1]/div/div/div/div[1]/div/div/div/table/tbody/tr[${index}]/td[5]/div/label`)
                let hour = await page.$x(`/html/body/div[3]/div[2]/div/div/div/div/form/div[1]/div/div[1]/div/div/div/div[1]/div/div/div/table/tbody/tr[${index}]/td[1]/span`)

                if (!wagon) {
                    break;
                } else {
                    let wagonText = await page.evaluate(el => el.textContent, wagon[0]);
                    let hourText = await page.evaluate(el => el.textContent, hour[0]);
                    // console.log(hourText)
                    // console.log(wagonText)

                    // Dont get "1. mevki" train ticket because it takes 2 times longer.
                    if (String(wagonText).match(allParanthesesRgx)[0].toLowerCase() !== "(1. mevki)") {
                        wagons.push({ wagonText, hourText })
                    }
                    // log(String(result).match(allParanthesesRgx)[0].toLowerCase(), result)
                    // log(possibleWagons)
                    index++
                }
            }
        }
        catch {
            //Get last parantheses from wagon info which contains possible seats.
            wagons = wagons.map((wagon) => ({ ...wagon, wagonText: (String(wagon.wagonText).match(lastParanthesesRgx)[1]) }));
            // //0 , 1 and 2 means there is no ticket for us. 

            wagons.forEach((wagon, _) => {
                wagon.wagonText -= 2
                wagon.wagonText = wagon.wagonText < 0 ? 0 : wagon.wagonText
                console.log(wagon.wagonText, "--", amount)
                if (wagon.wagonText >= amount) {
                    foundTickets.push(wagon)
                }
            })
            // console.log(foundTickets)
            // ({ wagonText }) => wagonText !== "2" && wagonText !== "1" && wagonText !== "0")
            // 
        }

        await page.waitForTimeout(250);

        if (foundTickets.length > 0) {
            log(chalk.red("******"));

            foundTickets.forEach(({ hourText }, _) => {
                log(chalk.green(`${hourText} saatinde Bilet Bulundu `));
            })

            log(chalk.red("******* "))

            await browser.close();
            return foundTickets;
        } else {
            log(chalk.green(" Yer bulamadım Bir daha deneyeceğim "))
        }


        if (String(page.url()).split("?")[1] == "expired=true") {
            log(chalk.red("****\nexpired tekrar deneniyor\n****\n"))
            await browser.close();
            return 0;
        }

        await browser.close();
        return 0;
    } catch (TimeoutError) {
        log("timeout")
    }
}

const createJob = (from, to, date, toMail, activeUsers, amonut) => {
    const id = randomUUID()

    schedule.scheduleJob(id, "*/30 * * * * *", function () {
        log(chalk.cyan("Trenbileti aranan tarih => " + chalk.cyan.bold(date)))
        log(chalk.blue.bold("saat : " + chalk.bold(new Date().toLocaleString().split(" ")[1]) + ". kontrol ediliyor.\n"))

        fetchTCDD(from, to, date, amonut)
            .then((foundTickets) => {
                if (foundTickets.length > 0) {
                    let mailText = "";

                    foundTickets.forEach(({ hourText }, _) => {
                        mailText += `${hourText} ,`
                    })


                    var mail = {
                        subject: date + ` Tarihinde ${foundTickets.length} adet bilet bulundu`.toUpperCase(),
                        text: date + "Tarihinde \n " + mailText + " saatlerinde bilet bulunmuştur."
                    }
                    sendMail(toMail, mail)
                    schedule.scheduledJobs[id].cancel()
                    activeUsers.emails.splice(activeUsers.emails.indexOf(toMail), 1)
                    console.log("active emails" + activeUsers.emails)
                    console.log("1 işlem sonlandırıldı. \nKalan işlem sayısı " + activeUsers.emails.length)
                }
            })
    });

}

const finishAllJobs = (activeUsers) => {
    activeUsers.emails = []
    console.log("Bütün işlemler sonlandırılıyor : \n " + "\n\nBaşarıyla sonlandırıldı ")
    schedule.gracefulShutdown()
}

module.exports = { createJob, finishAllJobs }
