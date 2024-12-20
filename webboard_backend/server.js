const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/db.config');
const authRoutes = require('./routes/authRoutes');
const threadRoutes = require('./routes/threadRoutes');
const replyRoutes = require('./routes/replyRoutes');

const adminUserRoutes = require('./routes/admin/adminUserRoutes');
const adminThreadRoutes = require('./routes/admin/adminThreadRoutes');
const adminReplyRoutes = require('./routes/admin/adminReplyRoutes');
const adminLogRoutes = require('./routes/admin/adminLogRoutes')
const cron = require('node-cron');
const { deleteExpiredThreads } = require('./controllers/threadController');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/replies', replyRoutes);

// Admin routes
app.use('/api/admin', adminUserRoutes);
app.use('/api/admin', adminThreadRoutes);
app.use('/api/admin', adminReplyRoutes);
app.use('/api/admin',adminLogRoutes);
// Schedule a job to run every 1 minutes
cron.schedule('* * * * *', () => {
    console.log('Checking for expired threads...');
    deleteExpiredThreads(); // Call the function to delete expired threads
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
