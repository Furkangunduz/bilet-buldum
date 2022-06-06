const puppeteer = require("puppeteer");
const chalk = require("chalk")

const URL =
    "https://ebilet.tcddtasimacilik.gov.tr/view/eybis/tnmGenel/tcddWebContent.jsf";

const from = "İzmit";
const to = "Ankara";
const date = "10.06.2022";

const allParanthesesRgx = /\([^()]+\)/g
const lastParanthesesRgx = /.*\(([^)]+)\)/
const log = console.log

var possibleWagons = []
var ticketFind = false

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
            return;
        } else {
            log(chalk.green("Yer bulamadım Bir daha deneyeceğim"))
        }


        if (String(page.url()).split("?")[1] == "expired=true") {
            log(chalk.red("****\nexpired tekrar deneniyor\n****\n"))
            await browser.close();
            return;
        }

        await browser.close();
    } catch (TimeoutError) {
        log("timeout")
    }
}


module.exports = {
    fetchTCDD,
}