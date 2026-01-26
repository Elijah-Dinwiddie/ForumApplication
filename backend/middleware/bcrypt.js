const bcrypt = require('bcrypt');

//middleware to hash passwords
const hashPassword = async (password) => {
    console.log('Hashing password in middleware...');
    const hashedPassword = await bcrypt.hash(password, 15);
    return hashedPassword;
};

//middleware to compare hashed passwords
const checkPassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

module.exports = {
    hashPassword,
    checkPassword
};