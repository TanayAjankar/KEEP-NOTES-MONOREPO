const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(
            `MongoDB connected successfully to ${conn.connection.host}/${conn.connection.name}`
        );
        return conn;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        // Don't throw the error - let the caller decide how to handle it
        return null;
    }
};

module.exports = connectDB;
