const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (dnsErr) {
    console.warn('Failed to set DNS servers:', dnsErr.message);
}

dotenv.config();
console.log('Using MONGO_URI:', process.env.MONGO_URI ? 'LOADED' : 'NOT LOADED');
if (!process.env.MONGO_URI) console.error('MONGO_URI is missing from .env!');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/principal', require('./routes/principalRoutes.js'));
app.use('/api/teacher', require('./routes/teacherRoutes.js'));
app.use('/api/student', require('./routes/studentRoutes.js'));
app.use('/api/public', require('./routes/publicRoutes.js'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_db')
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.send('School Management API is running...');
});
