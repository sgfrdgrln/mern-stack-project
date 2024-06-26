const mongoose = require('mongoose')

const LOCAL_DATABASE_URI = "mongodb://localhost:27017/TestDB"

const connectDB = async () => {
    try {
        await mongoose.connect(LOCAL_DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB
