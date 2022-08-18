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

module.exports = { removeUserFromUserList }