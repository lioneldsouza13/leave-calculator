const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = function (password, callback) {
    let hashedPassword = ''

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {

            hashedPassword = hash

            callback(hashedPassword)
        })
    })


}