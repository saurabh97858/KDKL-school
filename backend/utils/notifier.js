const nodemailer = require('nodemailer');

/**
 * Send an email notification. Falls back to console log if SMTP settings are missing.
 * @param {string} to Receiver email address
 * @param {string} subject Subject line
 * @param {string} text Plain text content
 * @param {string} html HTML content (optional)
 */
const sendEmail = async (to, subject, text, html = '') => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    // Check if email config is present
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.log('\n--- [EMAIL AUTO-NOTIFICATION (Console Fallback)] ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${text}`);
        if (html) console.log(`HTML: Available (omitted from terminal logs)`);
        console.log('-----------------------------------------------------\n');
        return { success: true, message: 'Email logged to console (SMTP not configured)' };
    }

    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            secure: Number(SMTP_PORT) === 465, // true for 465, false for others
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        const mailOptions = {
            from: SMTP_FROM || SMTP_USER,
            to,
            subject,
            text,
            html: html || text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email notification successfully sent to ${to}: ${info.messageId}`);
        return { success: true, info };
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Send an SMS notification. Logs the message payload in console.
 * @param {string} to Receiver phone number
 * @param {string} text Message text
 */
const sendSMS = async (to, text) => {
    console.log('\n--- [SMS AUTO-NOTIFICATION (Console Log)] ---');
    console.log(`To: ${to}`);
    console.log(`Message: ${text}`);
    console.log('---------------------------------------------\n');
    return { success: true, message: 'SMS logged to console' };
};

module.exports = { sendEmail, sendSMS };
