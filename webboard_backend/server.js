const express = require('express');
const { connectDB } = require('./config/db.config');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
