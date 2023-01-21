const removeUserFromUserList = (userList, mailToBeDeletedUser) => {
    let index = undefined;
    let id = undefined
    userList.forEach((user, indx) => {
        if (mailToBeDeletedUser == user.mail) {
            index = indx
            id = user.id
        }
    })
    if (index !== undefined || id !== undefined)
        userList.splice(index, 1)

    return id
}
const logActiveUsers = (activeUsers) => {
    console.log('Yeni bir arama başlatıldı.');
    console.log('Active users :');
    activeUsers.forEach((user) => {
        console.log('---' + user.mail + ":", `${user.from} ==> ${user.to}` + `: ${user.date} `);
    });
    console.log('\n');
}


module.exports = { removeUserFromUserList, logActiveUsers }