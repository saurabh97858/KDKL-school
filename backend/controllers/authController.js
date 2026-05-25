const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && (await user.comparePassword(password))) {
            const response = {
                _id: user._id,
                username: user.username,
                role: user.role,
                name: user.name,
                token: generateToken(user._id)
            };

            if (user.role === 'teacher') {
                const teacher = await Teacher.findOne({ user: user._id });
                if (teacher) response.assignedClass = teacher.assignedClass;
            } else if (user.role === 'student') {
                const student = await Student.findOne({ user: user._id });
                if (student) response.className = student.className;
            }

            res.json(response);
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const response = {
                _id: user._id,
                username: user.username,
                role: user.role,
                name: user.name,
                profilePic: user.profilePic
            };

            if (user.role === 'teacher') {
                const teacher = await Teacher.findOne({ user: user._id });
                if (teacher) response.assignedClass = teacher.assignedClass;
            } else if (user.role === 'student') {
                const student = await Student.findOne({ user: user._id });
                if (student) response.className = student.className;
            }

            res.json(response);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user && (await user.comparePassword(oldPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password changed successfully' });
        } else {
            res.status(401).json({ message: 'Incorrect old password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, getMe, changePassword };
