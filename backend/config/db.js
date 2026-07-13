const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MONGODB Connected");
    } catch (err) {
        console.log("Unable to Connect MongoDB");
        process.exit(1);
    }
};

module.exports = connectDB;