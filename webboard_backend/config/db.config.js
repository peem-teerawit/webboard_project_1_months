const mongoose = require('mongoose');

const dbConfig = {
    url: 'mongodb://localhost:27017/webboard', // Change the database name as needed
};

const connectDB = async () => {
    try {
        await mongoose.connect(dbConfig.url);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = { connectDB };
