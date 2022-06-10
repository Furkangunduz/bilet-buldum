function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDateObj(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}
function formatDateStr(date) {
    return date.split("-").reverse().join("-")
}
function formatDateyyyymmdd(date) {
    let splittedDate = date.split("-")
    return splittedDate[2] + "-" + splittedDate[1] + "-" + splittedDate[0]
}

export { formatDateObj, formatDateStr, formatDateyyyymmdd };