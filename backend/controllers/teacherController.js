const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// Import notifier utilities
const { sendEmail, sendSMS } = require('../utils/notifier');

// Get Students of assigned class
const getClassStudents = async (req, res) => {
    const { className } = req.params;
    const { medium, stream } = req.query;
    try {
        const query = { className };
        if (medium) query.medium = medium;
        if (stream) query.stream = stream;
        
        const students = await Student.find(query).populate('user', 'username name email profilePic');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark Attendance
const markAttendance = async (req, res) => {
    const { studentId, date, status, className } = req.body;
    try {
        let attendance = await Attendance.findOne({ student: studentId, date });
        if (attendance) {
            attendance.status = status;
            await attendance.save();
        } else {
            attendance = await Attendance.create({
                student: studentId,
                teacher: req.user._id, // User ID of the teacher
                date,
                status,
                className
            });
        }
        res.json({ message: 'Attendance marked successfully', attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Attendance History for a class
const getAttendanceHistory = async (req, res) => {
    const { className, date } = req.query;
    try {
        const attendance = await Attendance.find({ className, date }).populate('student', 'studentName');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload Result
const uploadResult = async (req, res) => {
    const { studentId, examType, date } = req.body;
    const pdfUrl = req.file ? req.file.path : null;

    if (!pdfUrl) return res.status(400).json({ message: 'PDF file is required' });

    try {
        const result = await Result.create({
            student: studentId,
            teacher: req.user._id,
            examType,
            date,
            pdfUrl
        });
        res.status(201).json({ message: 'Result uploaded successfully', result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage Leave Requests
const manageLeave = async (req, res) => {
    const { leaveId, status, teacherComment } = req.body;
    try {
        const leave = await LeaveRequest.findById(leaveId).populate('student');
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });

        leave.status = status;
        leave.teacherComment = teacherComment;
        await leave.save();

        // Send email notification to student/parent asynchronously
        if (leave.student && leave.student.emailId) {
            const subject = `Leave Request Status Update - KDKL School`;
            const text = `Dear Parent/Student,\n\nThe leave request for ${leave.student.studentName} (Class ${leave.student.className}) starting from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been reviewed.\n\nStatus: ${status}\nTeacher Comment: ${teacherComment || 'None'}\n\nRegards,\nClass Teacher\nKDKL School`;
            
            sendEmail(leave.student.emailId, subject, text).catch(e => console.error('Failed to send leave status email:', e.message));
        }

        // Send SMS log
        const smsPhone = leave.student?.mobileNumber || leave.student?.contactNumber;
        if (smsPhone) {
            const smsText = `Dear Parent, the leave request for ${leave.student.studentName} has been ${status}. Teacher Comment: ${teacherComment || 'None'}. KDKL School.`;
            sendSMS(smsPhone, smsText).catch(e => console.error('Failed to send leave status SMS:', e.message));
        }

        res.json({ message: `Leave request ${status}`, leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Leave Requests for teacher's class (simplified)
const getLeaveRequests = async (req, res) => {
    try {
        // In a real app, we'd filter by the students in the teacher's class
        const leaves = await LeaveRequest.find().populate('student', 'studentName className');
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteResult = async (req, res) => {
    try {
        await Result.findByIdAndDelete(req.params.id);
        res.json({ message: 'Result deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAttendance = async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Attendance record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getResults = async (req, res) => {
    try {
        const results = await Result.find({ student: req.params.studentId }).populate('teacher', 'name');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeacherStats = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ user: req.user._id });
        if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

        const studentsCount = await Student.countDocuments({ className: teacher.assignedClass });
        const pendingLeaves = await LeaveRequest.countDocuments({ teacher: req.user._id, status: 'Pending' });

        res.json({ classStudents: studentsCount, pendingLeaves });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getClassStudents, markAttendance, getAttendanceHistory, uploadResult, manageLeave, getLeaveRequests,
    deleteResult, deleteAttendance, getResults, getTeacherStats
};
