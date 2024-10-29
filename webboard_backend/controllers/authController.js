const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({ username, email, password: hashedPassword, role: role || 'user' });  // ตั้ง role เป็น user โดยค่าเริ่มต้น
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
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
        // ตรวจสอบว่า user._id และ user.role มีค่า
        // console.log('User ID:', user._id);  // ควรแสดง _id ของผู้ใช้
        // console.log('User Role:', user.role); // ควรแสดง role ของผู้ใช้
        res.json({ token, userId: user._id, role: user.role });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

