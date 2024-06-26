const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(LOCAL_DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB
