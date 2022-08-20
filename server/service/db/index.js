const { initdb } = require("./init")
const db = initdb()

const saveUserToDb = async (mail, from, to, amount, date, id) => {
    try {
        await db.collection("users").doc(id).set({
            mail,
            from,
            to,
            amount,
            date,
            id
        })
        console.log(`${mail} başarıyla database'e kaydedildi.`)
    } catch (error) {
        console.log("kullanıcı db'ye kayıt edilirken sorun oluştu \n" + error)

        return 0
    }
}

const getAllUsersFromDb = async () => {
    try {
        let usersRef = db.collection("users")
        let response = await usersRef.get()
        let responseArr = []
        response.forEach((doc) =>
            responseArr.push(doc.data())
        )
        return responseArr
    } catch (error) {
        console.log("kullanıcılar db'den alınırken sorun oluştu \n" + error)
    }
}

const deleteUserFromDb = async (id) => {
    try {
        let userRef = await db.collection("users").doc(id).delete()
        return userRef
    } catch (error) {
        console.log("kullanıcıyı db'den silerken sorun oluştu \n" + error)
    }
}

const deleteUserListFromDb = async (userList) => {
    try {
        for (let i = 0; i < userList.length; i++) {
            await deleteUserFromDb(userList[i].id)
        }
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = { saveUserToDb, getAllUsersFromDb, deleteUserFromDb, deleteUserListFromDb }