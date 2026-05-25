const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedPrincipal = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const principalExists = await User.findOne({ role: 'principal' });
        if (!principalExists) {
            await User.create({
                username: 'admin',
                password: 'adminpassword', // Will be hashed by pre-save hook
                role: 'principal',
                name: 'Main Principal',
                email: 'principal@school.com'
            });
            console.log('Principal account created: admin / adminpassword');
        } else {
            console.log('Principal account already exists');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedPrincipal();
