const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_db')
    .then(async () => {
        console.log('Connected to DB');
        const users = await User.find({}, 'username role password');
        console.log('Users in DB:', users);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
