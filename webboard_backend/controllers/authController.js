const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Log = require('../models/logModel');

// Register a new user
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({ username, email, password: hashedPassword, role: role || 'user' });  // ตั้ง role เป็น user โดยค่าเริ่มต้น
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });

        //get log from user login
        await Log.create({
            action: 'register',
            userId: newUser._id,
            username:username
        });

    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
};

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '3h' });

        // Log login action
        await Log.create({
            action: 'login',
            userId: user._id, // Use the logged-in user's ID
            username: username
        });

        res.json({ token, userId: user._id, role: user.role });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};


