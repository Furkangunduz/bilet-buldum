var admin = require("firebase-admin");
var serviceAccount = require("../../db_key.json");

function initdb() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
    return admin.firestore()
}


module.exports = { initdb }