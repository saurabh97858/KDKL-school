const express = require('express');
const router = express.Router();
const { 
    getClassStudents, markAttendance, getAttendanceHistory, uploadResult, 
    manageLeave, getLeaveRequests, deleteResult, deleteAttendance, 
    getResults, getTeacherStats
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('teacher'));

router.get('/students/:className', getClassStudents);
router.post('/attendance', markAttendance);
router.get('/attendance', getAttendanceHistory);
router.post('/results', uploadResult);
router.get('/results/:studentId', getResults);
router.get('/leaves', getLeaveRequests);
router.post('/manage-leave', manageLeave);
router.get('/stats', getTeacherStats);

module.exports = router;
