const Student = require('../models/Student');
const Result = require('../models/Result');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id }).populate('user', 'username name email profilePic phone');
        if (!student) return res.status(404).json({ message: 'Student profile not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentResults = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        const results = await Result.find({ student: student._id }).populate('teacher', 'teacherName');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const requestLeave = async (req, res) => {
    const { reason, startDate, endDate, teacherId } = req.body;
    try {
        const student = await Student.findOne({ user: req.user._id });
        const leave = await LeaveRequest.create({
            student: student._id,
            teacher: teacherId, // Usually their class teacher
            reason,
            startDate,
            endDate
        });
        res.status(201).json({ message: 'Leave request sent', leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfilePic = async (req, res) => {
    const profilePic = req.file ? req.file.path : null;
    if (!profilePic) return res.status(400).json({ message: 'Image file is required' });

    try {
        const user = await User.findById(req.user._id);
        user.profilePic = profilePic;
        await user.save();
        res.json({ message: 'Profile picture updated', profilePic });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyLeaves = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        const leaves = await LeaveRequest.find({ student: student._id }).populate('teacher', 'teacherName');
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudentProfile, getStudentResults, requestLeave, updateProfilePic, getMyLeaves };
