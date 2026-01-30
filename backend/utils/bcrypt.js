const bcrypt = require('bcrypt');

//util function to hash passwords
const hashItem = async (item) => {
    console.log('Hashing password');
    const hashedItem = await bcrypt.hash(item, 10);
    return hashedItem;
};

//util function to compare hashed passwords
const checkHash = async (item, hashedItem) => {
    const isMatch = await bcrypt.compare(item, hashedItem);
    return isMatch;
}

module.exports = {
    hashItem,
    checkHash
};