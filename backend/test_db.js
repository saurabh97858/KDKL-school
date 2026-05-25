const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topper = require('./models/Topper');
const FeeStructure = require('./models/FeeStructure');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected');
        try {
            const toppers = await Topper.find();
            console.log('Toppers:', toppers.length);
            const fees = await FeeStructure.find();
            console.log('Fees:', fees.length);
        } catch (err) {
            console.error('Query error:', err);
        }
        mongoose.connection.close();
    })
    .catch(err => console.error(err));
