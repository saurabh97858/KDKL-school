const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to Atlas');
        const users = await User.find({}, 'username role password');
        console.log('Users in DB (count):', users.length);
        users.forEach(u => console.log(`User: ${u.username}, Role: ${u.role}`));
        process.exit(0);
    })
    .catch(err => {
        console.error('Atlas connection failed:', err);
        process.exit(1);
    });
