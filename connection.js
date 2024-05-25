const mongoose = require('mongoose');
require('dotenv').config()

async function connectDB(){
    return await mongoose.connect(process.env.MONGODB_URL)
}

module.exports = {connectDB}