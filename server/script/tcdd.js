const puppeteer = require("puppeteer");
const chalk = require("chalk")
const schedule = require("node-schedule")

const { v4: uuidv4 } = require('uuid');
const { sendMail } = require("./script/mail")

const URL =
    "https://ebilet.tcddtasimacilik.gov.tr/view/eybis/tnmGenel/tcddWebContent.jsf";

const from = "İzmit";
const to = "Ankara";
const date = "13.06.2022";

const allParanthesesRgx = /\([^()]+\)/g
const lastParanthesesRgx = /.*\(([^)]+)\)/
const log = console.log

var possibleWagons = []
var ticketFind = false

//function returns 1 when it find ticket 
//otherwise return 0
async function fetchTCDD() {
    try {
        const browser = await puppeteer.launch({ headless: true });
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
            possibleWagons = []
            let index = 1;

            while (true) {
                let wagon = await page.$x(`/html/body/div[3]/div[2]/div/div/div/div/form/div[1]/div/div[1]/div/div/div/div[1]/div/div/div/table/tbody/tr[${index}]/td[5]/div/label`)
                if (!wagon) {
                    break;
                } else {
                    let result = await page.evaluate(el => el.textContent, wagon[0]);
                    // Dont get "1. mevki" train ticket because it takes 2 times longer.
                    if (String(result).match(allParanthesesRgx)[0].toLowerCase() !== "(1. mevki)") {
                        possibleWagons.push(result)
                    }
                    // log(String(result).match(allParanthesesRgx)[0].toLowerCase(), result)
                    // log(possibleWagons)
                    index++
                }
            }
        }
        catch {
            //Get last parantheses from wagon info.
            possibleWagons = possibleWagons.map((wagon) => (String(wagon).match(lastParanthesesRgx)[1]));
            //0,1 and 2 means there is no ticket for us. 
            ticketFind = possibleWagons.some((wagon) => wagon !== "2" && wagon !== "1" && wagon !== "0")
        }
        await page.waitForTimeout(250);

        if (ticketFind == true) {
            log(chalk.red("******"));
            log(chalk.green("Bilet Bulundu"));
            log(chalk.red("******* "))
            await browser.close();
            return 1;
        } else {
            log(chalk.green("Yer bulamadım Bir daha deneyeceğim"))
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
        return 0;
    }
}

const createJob = () => {
    const id = uuidv4()
    schedule.scheduleJob(id, "*/15 * * * * *", function () {

        log(chalk.cyan("Trenbileti aranan tarih => " + chalk.cyan.bold(date)))
        log(chalk.blue.bold("saat : " + chalk.bold(new Date().toLocaleString().split(" ")[1]) + ". kontrol ediliyor.\n"))

        fetchTCDD()
            .then((ticketFind) => {
                if (ticketFind) {
                    var mail = {
                        subject: date + " tarihi için bilet bulundu",
                        text: "Bilet Bulundu"
                    }
                    sendMail("Bigbeng41@gmail.com", mail)
                    schedule.scheduledJobs[id].cancel()
                }
            })
    });
}

module.exports = { createJob }
