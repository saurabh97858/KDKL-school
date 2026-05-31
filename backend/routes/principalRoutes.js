const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    addTeacher, addStudent, getTeachers, getStudentsByClass, getApplications,
    updateFounder, getFounder, uploadToGallery, updateGalleryItem, deleteFromGallery,
    addNotification, updateNotification, getNotifications, deleteNotification,
    updateTeacher, deleteTeacher, updateStudent, deleteStudent,
    getDashboardStats, updateSchoolSettings, 
    addPrincipalInfo, updatePrincipalInfo, getPrincipalInfo, deletePrincipalInfo,
    getFeesByClass, saveFeeRecord, addFeePayment, getFeesOverview,
    addTopper, getToppers, deleteTopper, updateTopper,
    addMoment, getMoments, deleteMoment, updateMoment,
    getFeeStructures, updateFeeStructure, updateApplicationStatus, generateAINotice
} = require('../controllers/principalController');
const { protect, authorize } = require('../middleware/authMiddleware');

const { storage } = require('../config/cloudinaryConfig');
const upload = multer({ storage });

router.use(protect);
router.use(authorize('principal'));

// Teachers
router.post('/add-teacher', upload.single('profilePic'), addTeacher);
router.get('/teachers', getTeachers);
router.put('/teacher/:id', upload.single('profilePic'), updateTeacher);
router.delete('/teacher/:id', deleteTeacher);

// Students
router.post('/add-student', addStudent);
router.get('/students/:className', getStudentsByClass);
router.get('/fetch-students', getStudentsByClass);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);

// Admission
router.get('/applications', getApplications);

// Founder
router.put('/founder', upload.single('founderPic'), updateFounder);
router.get('/founder', getFounder);

// Gallery
router.post('/gallery', upload.single('galleryPic'), uploadToGallery);
router.put('/gallery/:id', upload.single('galleryPic'), updateGalleryItem);
router.delete('/gallery/:id', deleteFromGallery);

// Notifications
router.post('/notifications', addNotification);
router.get('/notifications', getNotifications);
router.put('/notifications/:id', updateNotification);
router.delete('/notifications/:id', deleteNotification);

router.get('/stats', getDashboardStats);

// School Settings
router.put('/settings', updateSchoolSettings);

// Principal Info (Leaders)
router.get('/principal-info', getPrincipalInfo);
router.post('/principal-info', upload.single('founderPic'), addPrincipalInfo);
router.put('/principal-info/:id', upload.single('founderPic'), updatePrincipalInfo);
router.delete('/principal-info/:id', deletePrincipalInfo);

// Fee Management
router.get('/fees/overview', getFeesOverview);
router.get('/fees/class/:className', getFeesByClass);
router.post('/fees/student/:studentId', saveFeeRecord);
// router.put('/fees/student/:studentId', saveFeeRecord); // Duplicate removed
router.post('/fees/student/:studentId/payment', addFeePayment);

// Toppers & Moments
router.post('/toppers', upload.single('topperPic'), addTopper);
router.get('/toppers', getToppers);
router.put('/toppers/:id', upload.single('topperPic'), updateTopper);
router.delete('/toppers/:id', deleteTopper);

router.post('/moments', upload.single('momentPic'), addMoment);
router.get('/moments', getMoments);
router.put('/moments/:id', upload.single('momentPic'), updateMoment);
router.delete('/moments/:id', deleteMoment);

// Fee Structure
router.get('/fee-structure', getFeeStructures);
router.post('/fee-structure', updateFeeStructure);

// Admission Status
router.put('/application-status/:id', updateApplicationStatus);

// AI notice generator
router.post('/generate-notice', generateAINotice);

module.exports = router;
