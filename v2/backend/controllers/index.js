const { randomUUID } = require("crypto");
const httpStatus = require("http-status");

const { removeUserFromUserList, logActiveUsers } = require("../utils/user");
const { saveUserToDb, deleteUserFromDb } = require("../config/db");

const test = (req, res) => {
  res.send("hello");
};

const addNewSearch = async (req, res) => {
  try {
    console.log("addNewSearch => ", req.body);
    const { activeUsers, db, cron } = req;

    const { station_from, station_to, date, time, email, amount } = req.body;
    const id = randomUUID();

    const mailExist = activeUsers.some((user) => user.email === email);

    if (mailExist) {
      console.log(email, "en fazla 1 arama yapılabilir.");
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        status: "fail",
        text: "Bu mail adresi ile daha önce arama yapılmış. Lütfen yeni bir mail adresi ile tekrar deneyiniz.",
      });
    }
    cron.setFrequencyDefault();

    activeUsers.push({ email, station_from, station_to, amount, date, id, time });
    logActiveUsers(activeUsers);

    await saveUserToDb(db, { email, station_from, station_to, amount, date, id, time });
    // sendMail(email, {
    //   subject: "BİLET ARAMAYA BAŞLADIM",
    //   text: `\n${date} tarihi için ${amount} adet bilet aramaya başladım.\n Bilet bulduğumda haber vereceğim.`,
    // });

    return res.status(httpStatus.OK).send({
      status: "ok",
      text: "Bilet aramaya başladım. Bilet bulduğumda haber vereceğim.",
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: "fail",
      text: "Bilet aramaya başlayamadım. Lütfen daha sonra tekrar deneyiniz.",
    });
  }
};

const finishJobByMail = async (req, res) => {
  try {
    const email = req.body.email || req.user.email;
    const activeUsers = req.activeUsers;
    const db = req.db;

    let removedUserId = removeUserFromUserList(activeUsers, email);
    if (removedUserId) {
      await deleteUserFromDb(db, removedUserId);
      return res.status(httpStatus.OK).send({
        status: "ok",
        text: "Bilet arama sonlandırıldı",
      });
    } else {
      throw new Error("Mail adresi bulunamadı.");
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: "fail",
      text: "Bilet arama sonlandırılamadı. Lütfen daha sonra tekrar deneyiniz.",
    });
  }
};

module.exports = {
  test,
  addNewSearch,
  finishJobByMail,
};
