function validateEmail(emailAdress) {
    var re = /\S+@\S+\.\S+/;
    return re.test(emailAdress);
}

export { validateEmail }