require('dotenv').config()

let MONGODB_URI=process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
    MONGODB_URI=process.env.MONGODB_TEST_URI
}

const PORT=process.env.PORT || 3001

module.exports = {
    MONGODB_URI, PORT
}