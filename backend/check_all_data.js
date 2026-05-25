const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Topper = require('./models/Topper');
const FeeStructure = require('./models/FeeStructure');
const Gallery = require('./models/Gallery');
const Moment = require('./models/Moment');
const Notification = require('./models/Notification');
const SchoolSettings = require('./models/SchoolSettings');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_db')
    .then(async () => {
        console.log('Connected to DB');
        
        const countUsers = await User.countDocuments();
        const countToppers = await Topper.countDocuments();
        const countFees = await FeeStructure.countDocuments();
        const countGallery = await Gallery.countDocuments();
        const countMoments = await Moment.countDocuments();
        const countNotifications = await Notification.countDocuments();
        const countSettings = await SchoolSettings.countDocuments();

        console.log('--- Collections count ---');
        console.log('Users:', countUsers);
        console.log('Toppers:', countToppers);
        console.log('FeeStructures:', countFees);
        console.log('Gallery Items:', countGallery);
        console.log('Moments:', countMoments);
        console.log('Notifications:', countNotifications);
        console.log('SchoolSettings:', countSettings);

        if (countSettings > 0) {
            const settings = await SchoolSettings.findOne();
            console.log('SchoolSettings sample:', settings);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
