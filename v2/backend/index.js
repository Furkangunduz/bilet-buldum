const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3002;
require("./config/env")();

const { Cron, Puppet, Mailer } = require("./classes/index.js");
const Sms = require("./services/sms.js");
const controllers = require("./controllers/index.js");
const initdb = require("./config/db.js");
const { logActiveUsers, removeUserFromUserList } = require("./utils/user");
const { deleteUserFromDb, getAllUsersFromDb } = require("./utils/db");
const { isPast } = require("./utils/helpers");

let activeUsers = [];
const db = initdb();

getAllUsersFromDb(db).then((response) => {
  if (response) {
    activeUsers = response;
    logActiveUsers(activeUsers);
    if (activeUsers.length > 0) {
      cron.setFrequencyDefault();
    }
  }
});
const app = express();
const cron = new Cron();
const puppet = new Puppet();
const mailer = new Mailer();
const SmsService = new Sms();

cron.startJob(async () => {
  try {
    if (activeUsers.length === 0) {
      cron.setFrequencyLower();
      return console.log("Aktif kullanıcı yok.");
    }

    for (let i = 0; i < activeUsers.length; i++) {
      if (isPast(activeUsers[i].date)) {
        console.log(`${activeUsers[i].email} için tarih geçmiş. Kullanıcı siliniyor.`);
        finishJobByMail(activeUsers[i].email, activeUsers, db);
      }
      await puppet.createBrowser();
      await puppet.createPage();

      const { email, station_from, station_to, date, amount, time, id } = activeUsers[i];
      puppet.setActiveSearchData({ email, station_from, station_to, date, amount, time, id });

      console.log(`\n${email} için arama yapılıyor...`);

      await puppet.gotoSearchPage();
      const tickets = await puppet.searchForTicket();

      await puppet.closePage();
      await puppet.closeBrowser();

      if (tickets?.length === 0) {
        console.log(`${email} için bilet bulunamadı.`);
      } else {
        console.log(`${email} için bilet bulundu. Mail gönderiliyor...`);
        mailer.sendMail(email, mailer.createMailText(tickets, date, amount));
        finishJobByMail(email, activeUsers, db);
        i -= 1;
      }
    }
  } catch (error) {
    console.log("\nError Cron => ", error);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", controllers.test);
app.post("/", setVariablesToReqBody, controllers.addNewSearch);
app.post("/finishSingleJob", setVariablesToReqBody, controllers.finishJobByMail);

function setVariablesToReqBody(req, res, next) {
  req.activeUsers = activeUsers;
  req.db = db;
  req.cron = cron;
  next();
}
async function finishJobByMail(email, activeUsers, db) {
  try {
    console.log(`${email} için arama sonlandırılıyor...`);
    let removedUserId = removeUserFromUserList(activeUsers, email);
    if (removedUserId) {
      await deleteUserFromDb(db, removedUserId);
      console.log(`${email} için arama sonlandırıldı.`);
    }
  } catch (error) {
    console.log("Error finishJobByMail => ", error);
  }
}

app.listen(PORT, () => {
  console.log(`PORT:${PORT} dinleniyor.\n`);
});
