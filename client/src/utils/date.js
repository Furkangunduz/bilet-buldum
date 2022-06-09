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

export { formatDateObj, formatDateStr };