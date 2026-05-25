const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const AdmissionApplication = require('../models/AdmissionApplication');
const Founder = require('../models/Founder');
const Gallery = require('../models/Gallery');
const Notification = require('../models/Notification');
const SchoolSettings = require('../models/SchoolSettings');
const PrincipalInfo = require('../models/PrincipalInfo');
const FeeRecord = require('../models/FeeRecord');
const Topper = require('../models/Topper');
const Moment = require('../models/Moment');
const FeeStructure = require('../models/FeeStructure');

// Add Teacher
const addTeacher = async (req, res) => {
    const { username, password, name, email, mobileNumber, currentAddress, permanentAddress, salary, subject, assignedClass, qualification, experience, role, expertIn, medium } = req.body;
    const profilePic = req.file ? req.file.path : null;
    
    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'Username already exists' });

        const user = await User.create({ username, password, role: 'teacher', name, email, phone: mobileNumber });
        const teacher = await Teacher.create({
            user: user._id,
            teacherName: name,
            mobileNumber,
            emailId: email,
            currentAddress,
            permanentAddress,
            salary,
            subject,
            assignedClass,
            profilePic,
            qualification,
            experience,
            expertIn,
            medium,
            role
        });

        res.status(201).json({ message: 'Teacher added successfully', teacher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Student
const addStudent = async (req, res) => {
    const { username, password, name, email, mobileNumber, className, motherName, fatherName, contactNumber, permanentAddress, currentAddress, fees, previousSchool, admissionDate, medium, stream } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'Username already exists' });

        const user = await User.create({ username, password, role: 'student', name, email, phone: mobileNumber });
        const student = await Student.create({
            user: user._id,
            studentName: name,
            mobileNumber,
            className,
            emailId: email,
            motherName,
            fatherName,
            contactNumber,
            permanentAddress,
            currentAddress,
            fees,
            medium,
            stream,
            previousSchool,
            admissionDate: admissionDate || new Date()
        });

        res.status(201).json({ message: 'Student added successfully', student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Teachers
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('user', 'username name email phone');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Students by Class (also handles fetch-students alias)
const getStudentsByClass = async (req, res) => {
    let { className } = req.params;
    const { medium, stream } = req.query;
    
    // If className is not in params, check query (for alias /fetch-students?class=...)
    if (!className) className = req.query.className || req.query.class;

    try {
        const query = {};
        if (className) query.className = className;
        if (medium) query.medium = medium;
        if (stream) query.stream = stream;
        
        const students = await Student.find(query).populate('user', 'username name email phone');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Admission Applications
const getApplications = async (req, res) => {
    try {
        const applications = await AdmissionApplication.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Teacher
const updateTeacher = async (req, res) => {
    try {
        const { name, email, mobileNumber, currentAddress, permanentAddress, salary, subject, assignedClass, qualification, experience, role, expertIn, medium } = req.body;
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        if (req.file) {
            teacher.profilePic = req.file.path;
        }

        // Credential Management for Teachers
        const { username, password } = req.body;
        if (username || password) {
            const user = await User.findById(teacher.user);
            if (user) {
                if (username) user.username = username;
                if (password) user.password = password; // Pre-save hook will hash it
                await user.save();
            }
        }

        teacher.teacherName = name || teacher.teacherName;
        teacher.mobileNumber = mobileNumber || teacher.mobileNumber;
        teacher.emailId = email || teacher.emailId;
        teacher.currentAddress = currentAddress || teacher.currentAddress;
        teacher.permanentAddress = permanentAddress || teacher.permanentAddress;
        teacher.salary = salary || teacher.salary;
        teacher.subject = subject || teacher.subject;
        teacher.assignedClass = assignedClass || teacher.assignedClass;
        teacher.qualification = qualification || teacher.qualification;
        teacher.experience = experience || teacher.experience;
        teacher.expertIn = expertIn || teacher.expertIn;
        teacher.medium = medium || teacher.medium;
        teacher.role = role || teacher.role;

        await teacher.save();
        res.json({ message: 'Teacher updated successfully', teacher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        await User.findByIdAndDelete(teacher.user);
        await Teacher.findByIdAndDelete(req.params.id);
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Student
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        Object.assign(student, req.body);
        await student.save();
        res.json({ message: 'Student updated successfully', student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        await User.findByIdAndDelete(student.user);
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage Founder
const updateFounder = async (req, res) => {
    const { name, message, removePic } = req.body;
    try {
        let founder = await Founder.findOne();
        if (!founder) {
            founder = new Founder({ name: name || 'Founder Name', message: message || 'Founder Message' });
        } else {
            founder.name = name || founder.name;
            founder.message = message || founder.message;
        }

        if (removePic === 'true') {
            founder.imageUrl = null;
        } else if (req.file) {
            founder.imageUrl = req.file.path;
        }

        await founder.save();
        res.json({ message: 'Founder info updated', founder });
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

// Manage Gallery
const uploadToGallery = async (req, res) => {
    const { title, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    const imageUrl = req.file.path;
    try {
        const galleryItem = await Gallery.create({ title, imageUrl, category });
        res.status(201).json(galleryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGalleryItem = async (req, res) => {
    try {
        const { title, category } = req.body;
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) return res.status(404).json({ message: 'Item not found' });

        galleryItem.title = title || galleryItem.title;
        galleryItem.category = category || galleryItem.category;
        if (req.file) galleryItem.imageUrl = req.file.path;

        await galleryItem.save();
        res.json(galleryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFromGallery = async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage Notifications
const addNotification = async (req, res) => {
    try {
        const { message, type } = req.body;
        const notification = await Notification.create({ message, type });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateNotification = async (req, res) => {
    try {
        const { message, type } = req.body;
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        notification.message = message || notification.message;
        notification.type = type || notification.type;

        await notification.save();
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const teachersCount = await Teacher.countDocuments();
        const studentsCount = await Student.countDocuments();
        const appsCount = await AdmissionApplication.countDocuments();
        res.json({ teachers: teachersCount, students: studentsCount, applications: appsCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSchoolSettings = async (req, res) => {
    try {
        let settings = await SchoolSettings.findOne();
        if (!settings) {
            settings = new SchoolSettings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();
        res.json({ message: 'School settings updated successfully', settings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPrincipalInfo = async (req, res) => {
    const { name, role, experience } = req.body;
    try {
        let imageUrl = null;
        if (req.file) {
            imageUrl = req.file.path;
        }
        const principal = new PrincipalInfo({
            name: name || 'Leader Name',
            role: role || 'Role',
            experience: experience || 'Experience years',
            imageUrl
        });
        await principal.save();
        res.status(201).json({ message: 'Leader added successfully', principal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePrincipalInfo = async (req, res) => {
    const { name, role, experience, removePic } = req.body;
    try {
        const principal = await PrincipalInfo.findById(req.params.id);
        if (!principal) return res.status(404).json({ message: 'Leader not found' });

        principal.name = name || principal.name;
        principal.role = role || principal.role;
        principal.experience = experience || principal.experience;

        if (removePic === 'true') {
            principal.imageUrl = null;
        } else if (req.file) {
            principal.imageUrl = req.file.path;
        }

        await principal.save();
        res.json({ message: 'Leader info updated', principal });
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

const deletePrincipalInfo = async (req, res) => {
    try {
        await PrincipalInfo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leader deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ===== FEE MANAGEMENT =====

// Get all students in a class with their fee records
const getFeesByClass = async (req, res) => {
    try {
        const { className } = req.params;
        const { medium, stream } = req.query;
        const query = { className };
        if (medium) query.medium = medium;
        if (stream) query.stream = stream;
        
        const students = await Student.find(query).populate('user', 'name username');
        const studentIds = students.map(s => s._id);
        const feeRecords = await FeeRecord.find({ student: { $in: studentIds } });
        
        const feeMap = {};
        feeRecords.forEach(f => { feeMap[f.student.toString()] = f; });
        
        const result = students.map(s => ({
            _id: s._id,
            studentName: s.studentName,
            className: s.className,
            fatherName: s.fatherName,
            feeRecord: feeMap[s._id.toString()] || null
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Save or update a student's fee record
const saveFeeRecord = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { totalFees, depositedFees, fine, fineDescription, otherCharges, otherChargesDescription, dueDate, remarks } = req.body;
        
        let feeRecord = await FeeRecord.findOne({ student: studentId });
        if (!feeRecord) {
            feeRecord = new FeeRecord({ student: studentId });
        }
        
        feeRecord.totalFees = Number(totalFees) || 0;
        feeRecord.depositedFees = Number(depositedFees) || 0;
        feeRecord.fine = Number(fine) || 0;
        feeRecord.fineDescription = fineDescription || '';
        feeRecord.otherCharges = Number(otherCharges) || 0;
        feeRecord.otherChargesDescription = otherChargesDescription || '';
        feeRecord.dueDate = dueDate || null;
        feeRecord.remarks = remarks || '';
        
        await feeRecord.save();
        res.json({ message: 'Fee record saved', feeRecord });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a payment entry to history
const addFeePayment = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { amount, mode, note } = req.body;
        
        let feeRecord = await FeeRecord.findOne({ student: studentId });
        if (!feeRecord) return res.status(404).json({ message: 'Fee record not found. Create fee record first.' });
        
        feeRecord.paymentHistory.push({
            amount: Number(amount),
            paymentDate: new Date(),
            mode: mode || 'Cash',
            note: note || ''
        });
        feeRecord.depositedFees += Number(amount);
        feeRecord.lastPaymentDate = new Date();
        
        await feeRecord.save();
        res.json({ message: 'Payment added', feeRecord });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Student: get own fee record
const getStudentFees = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });
        const feeRecord = await FeeRecord.findOne({ student: student._id });
        res.json(feeRecord || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { 
    addTeacher, addStudent, getTeachers, getStudentsByClass, getApplications, 
    updateFounder, getFounder, 
    uploadToGallery, updateGalleryItem, deleteFromGallery,
    addNotification, updateNotification, getNotifications, deleteNotification,
    updateTeacher, deleteTeacher, updateStudent, deleteStudent,
    getDashboardStats, updateSchoolSettings, 
    addPrincipalInfo, updatePrincipalInfo, getPrincipalInfo, deletePrincipalInfo,
    getFeesByClass, saveFeeRecord, addFeePayment, getStudentFees,
    
    // Toppers
    addTopper: async (req, res) => {
        try {
            const { studentName, className, percentage } = req.body;
            const imageUrl = req.file ? req.file.path : null;
            const topper = await Topper.create({ studentName, className, percentage, imageUrl });
            res.status(201).json(topper);
        } catch (error) { res.status(500).json({ message: error.message }); }
    },
    getToppers: async (req, res) => {
        try {
            const toppers = await Topper.find().sort({ createdAt: -1 });
            res.json(toppers);
        } catch (error) { res.status(500).json({ message: error.message }); }
    },
    deleteTopper: async (req, res) => {
        try {
            await Topper.findByIdAndDelete(req.params.id);
            res.json({ message: 'Topper deleted' });
        } catch (error) { res.status(500).json({ message: error.message }); }
    },

    // Moments
    addMoment: async (req, res) => {
        try {
            const { title, description } = req.body;
            const imageUrl = req.file ? req.file.path : null;
            const moment = await Moment.create({ title, description, imageUrl });
            res.status(201).json(moment);
        } catch (error) { res.status(500).json({ message: error.message }); }
    },
    getMoments: async (req, res) => {
        try {
            const moments = await Moment.find().sort({ createdAt: -1 });
            res.json(moments);
        } catch (error) { res.status(500).json({ message: error.message }); }
    },
    deleteMoment: async (req, res) => {
        try {
            await Moment.findByIdAndDelete(req.params.id);
            res.json({ message: 'Moment deleted' });
        } catch (error) { res.status(500).json({ message: error.message }); }
    },

    // Fee Structure
    getFeeStructures: async (req, res) => {
        try {
            const feeStructures = await FeeStructure.find();
            res.json(feeStructures);
        } catch (error) { res.status(500).json({ message: error.message }); }
    },
    updateFeeStructure: async (req, res) => {
        try {
            const { className, medium, tuitionFee, booksFee, dressFee, admissionCharges, otherCharges } = req.body;
            
            if (!className) return res.status(400).json({ message: 'Class name is required' });

            // Sanitize inputs to ensure they are valid numbers
            const tuition = Number(tuitionFee) || 0;
            const books = Number(booksFee) || 0;
            const dress = Number(dressFee) || 0;
            const admission = Number(admissionCharges) || 0;
            const other = Number(otherCharges) || 0;
            
            const total = tuition + books + dress + admission + other;
            
            const fee = await FeeStructure.findOneAndUpdate(
                { className, medium: medium || 'Hindi' },
                { 
                    tuitionFee: tuition, 
                    booksFee: books, 
                    dressFee: dress, 
                    admissionCharges: admission, 
                    otherCharges: other, 
                    total 
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            res.json(fee);
        } catch (error) { 
            console.error('Error updating fee structure:', error);
            res.status(500).json({ message: 'Internal Server Error: ' + error.message }); 
        }
    },

    // Admission Status
    updateApplicationStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const application = await AdmissionApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
            res.json(application);
        } catch (error) { res.status(500).json({ message: error.message }); }
    }
};
