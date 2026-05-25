const AdmissionApplication = require('../models/AdmissionApplication');
const Gallery = require('../models/Gallery');
const Founder = require('../models/Founder');
const Notification = require('../models/Notification');
const SchoolSettings = require('../models/SchoolSettings');
const PrincipalInfo = require('../models/PrincipalInfo');
const Teacher = require('../models/Teacher');
const Topper = require('../models/Topper');
const Moment = require('../models/Moment');
const FeeStructure = require('../models/FeeStructure');

const applyForAdmission = async (req, res) => {
    try {
        const application = await AdmissionApplication.create(req.body);
        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGallery = async (req, res) => {
    try {
        const photos = await Gallery.find().sort({ createdAt: -1 });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFounder = async (req, res) => {
    try {
        const founder = await Founder.findOne();
        res.json(founder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActiveNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadGalleryPhoto = async (req, res) => {
    const imageUrl = req.file ? req.file.path : null;
    if (!imageUrl) return res.status(400).json({ message: 'Image file is required' });

    try {
        const photo = await Gallery.create({ imageUrl, title: req.body.title, uploadedBy: req.user._id });
        res.status(201).json({ message: 'Photo uploaded to gallery', photo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSchoolSettings = async (req, res) => {
    try {
        let settings = await SchoolSettings.findOne();
        if (!settings) {
            settings = await SchoolSettings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPrincipalInfo = async (req, res) => {
    try {
        const principals = await PrincipalInfo.find();
        res.json(principals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({}, 'teacherName subject qualification experience profilePic role expertIn medium');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getToppers = async (req, res) => {
    try {
        const toppers = await Topper.find().sort({ createdAt: -1 });
        res.json(toppers);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getMoments = async (req, res) => {
    try {
        const moments = await Moment.find().sort({ createdAt: -1 });
        res.json(moments);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getFeeStructure = async (req, res) => {
    try {
        const feeStructure = await FeeStructure.find().sort({ className: 1 });
        res.json(feeStructure);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { 
    applyForAdmission, getGallery, uploadGalleryPhoto, getFounder, 
    getActiveNotifications, getSchoolSettings, getPrincipalInfo, getTeachers,
    getToppers, getMoments, getFeeStructure
};
