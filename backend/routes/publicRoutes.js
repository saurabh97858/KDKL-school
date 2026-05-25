const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    applyForAdmission, getGallery, uploadGalleryPhoto, getFounder, 
    getActiveNotifications, getSchoolSettings, getPrincipalInfo, getTeachers,
    getToppers, getMoments, getFeeStructure
} = require('../controllers/publicController');
const { protect, authorize } = require('../middleware/authMiddleware');

const { storage } = require('../config/cloudinaryConfig');
const upload = multer({ storage });

router.post('/apply', applyForAdmission);
router.get('/gallery', getGallery);
router.get('/founder', getFounder);
router.get('/notifications', getActiveNotifications);
router.get('/settings', getSchoolSettings);
router.get('/principal', getPrincipalInfo);
router.get('/teachers', getTeachers);
router.get('/toppers', getToppers);
router.get('/moments', getMoments);
router.get('/fee-structure', getFeeStructure);
router.post('/gallery-upload', protect, authorize('principal'), upload.single('galleryImage'), uploadGalleryPhoto);

module.exports = router;
