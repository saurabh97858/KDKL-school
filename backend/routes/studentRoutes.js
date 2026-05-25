const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getStudentProfile, getStudentResults, requestLeave, updateProfilePic, getMyLeaves } = require('../controllers/studentController');
const { getStudentFees } = require('../controllers/principalController');
const { protect, authorize } = require('../middleware/authMiddleware');

const { storage } = require('../config/cloudinaryConfig');
const upload = multer({ storage });

router.use(protect);
router.use(authorize('student'));

router.get('/profile', getStudentProfile);
router.get('/results', getStudentResults);
router.get('/my-leaves', getMyLeaves);
router.post('/request-leave', requestLeave);
router.put('/update-profile-pic', upload.single('profilePic'), updateProfilePic);
router.get('/my-fees', getStudentFees);

module.exports = router;
