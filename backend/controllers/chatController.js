const { GoogleGenerativeAI } = require('@google/generative-ai');
const SchoolSettings = require('../models/SchoolSettings');
const FeeStructure = require('../models/FeeStructure');
const PrincipalInfo = require('../models/PrincipalInfo');
const Founder = require('../models/Founder');
const Teacher = require('../models/Teacher');

/**
 * Fallback local query solver using live DB data when Google API is offline or has issues.
 */
const getSimulatedResponse = (message, settings, feeStructure, principals, founder, teachers) => {
    const msg = (message || '').toLowerCase();
    
    // Address / Location
    if (msg.includes('address') || msg.includes('location') || msg.includes('kahan') || msg.includes('place') || msg.includes('patta') || msg.includes('पता') || msg.includes('कहाँ') || msg.includes('address') || msg.includes('rasta')) {
        return `Namaste! KDKL Shastri Inter College & Kavita Public School is located at:\n📍 Address: ${settings.address || 'Main Road, New Delhi, 110012'}.\nYou are welcome to visit us during school hours!`;
    }
    
    // Fees / Fee
    if (msg.includes('fee') || msg.includes('charge') || msg.includes('rupees') || msg.includes('paisa') || msg.includes('fees') || msg.includes('फीस') || msg.includes('शुल्क')) {
        if (feeStructure && feeStructure.length > 0) {
            const list = feeStructure.map(f => `Class ${f.className} (${f.medium} Medium): Tuition ₹${f.tuitionFee}, Books ₹${f.booksFee || 0}, Dress ₹${f.dressFee || 0}, Admission ₹${f.admissionCharges || f.admissionFee || 0}, Total ₹${f.total || 0}`).join('\n');
            return `Namaste! Here is our fee structure:\n${list}\nFor detailed query, please check the 'Fees' page on our website or visit the admissions office.`;
        }
        return `Namaste! Fee structure details can be checked from the 'Fees' page on our website. Please submit an admission form or visit the admin desk for details.`;
    }
    
    // Contact / Phone / Email
    if (msg.includes('contact') || msg.includes('phone') || msg.includes('mobile') || msg.includes('number') || msg.includes('email') || msg.includes('call') || msg.includes('संपर्क') || msg.includes('फोन') || msg.includes('no.')) {
        return `Namaste! You can contact us via:\n📞 Phone: ${settings.phone1 || '+91 98765 43210'} ${settings.phone2 ? ", " + settings.phone2 : ""}\n✉️ Email: ${settings.email || 'contact@kdklschool.com'}\nFeel free to call during office hours (8:00 AM - 2:00 PM).`;
    }

    // Principal / Founder / Leader
    if (msg.includes('principal') || msg.includes('founder') || msg.includes('ashok') || msg.includes('krishn') || msg.includes('owner') || msg.includes('pradhan') || msg.includes('प्रधानाचार्य') || msg.includes('संस्थापक')) {
        let response = `Namaste! `;
        if (founder && founder.name) response += `Our school was founded by Late Shri ${founder.name}. `;
        if (principals && principals.length > 0) {
            const leaders = principals.map(p => `${p.name} (${p.role})`).join(', ');
            response += `The school is led by: ${leaders}.`;
        } else {
            response += `The school is led by our principal and management board.`;
        }
        return response;
    }

    // Teachers / Faculty
    if (msg.includes('teacher') || msg.includes('faculty') || msg.includes('sir') || msg.includes('madam') || msg.includes('staff') || msg.includes('शिक्षक') || msg.includes('padhane')) {
        if (teachers && teachers.length > 0) {
            const list = teachers.map(t => `- ${t.teacherName} (Subject: ${t.subject})`).join('\n');
            return `Namaste! We have experienced faculty members. Here is some of our teaching staff:\n${list}`;
        }
        return `Namaste! We have experienced and dedicated teachers for all classes. Please visit our campus to meet the faculty!`;
    }

    // Default Fallback
    return `Namaste! Welcome to KDKL Shastri Inter College & Kavita Public School.\n` +
           `We are located at ${settings.address || 'Main Road'}.\n` +
           `You can call us at ${settings.phone1 || '+91 98765 43210'} or email us at ${settings.email || 'contact@kdklschool.com'}.\n` +
           `Please visit the 'Admission' section on our website to apply online!`;
};

/**
 * Handle incoming public chat queries and route them to Gemini API constrained to live DB records.
 */
const getChatbotResponse = async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        // 1. Fetch live data from the database
        const settings = await SchoolSettings.findOne() || {};
        const feeStructure = await FeeStructure.find().sort({ className: 1 }) || [];
        const principals = await PrincipalInfo.find() || [];
        const founder = await Founder.findOne() || {};
        const teachers = await Teacher.find({}, 'teacherName subject experience') || [];

        // 2. Build the system instruction using actual DB data
        const systemInstruction = `
You are KDKL Bot, the official AI Admissions and Support Assistant for KDKL Shastri Inter College & Kavita Public School (KDKL SIC & KPS).
Answer queries politely, concisely, and formally. Respond in a mix of Hindi and English (Hinglish), matching the conversational language of the user.

Here is the official school data currently displayed on the website:
- School Contact Details:
  Address: ${settings.address || 'KDKL Shastri Inter College, Main Road, New Delhi, 110012'}
  Email: ${settings.email || 'contact@kdklschool.com'}
  Phone: ${settings.phone1 || '+91 98765 43210'} ${settings.phone2 ? ", " + settings.phone2 : ""}
  Instagram: ${settings.instagramUrl || '#'}
  Facebook: ${settings.facebookUrl || '#'}
- Fee Structure Details:
  ${feeStructure.map(f => `Class ${f.className} (${f.medium} Medium): Tuition Fee ₹${f.tuitionFee}, Books Fee ₹${f.booksFee || 0}, Dress Fee ₹${f.dressFee || 0}, Admission Fee ₹${f.admissionCharges || f.admissionFee || 0}, Other Fee ₹${f.otherCharges || f.otherFee || 0}, Total ₹${f.total || 0}`).join('\n  ')}
- School Administration Leaders:
  ${principals.map(p => `${p.name} (Role: ${p.role}, Exp: ${p.experience})`).join(', ')}
- School Founder:
  Founder Name: ${founder.name || 'N/A'}
- Expert Faculty Members:
  ${teachers.map(t => `${t.teacherName} (Subject: ${t.subject}, Exp: ${t.experience})`).join('\n  ')}

RULES:
1. ONLY answer queries using the official school data provided above.
2. If the user asks about something not in the school data (e.g., general science, maths calculations, coding, politics), politely state: "I can only answer questions related to KDKL Shastri Inter College & Kavita Public School admissions, fees, timings, and contact details."
3. Be warm, welcoming, and encourage parents to fill out the Online Admission Application form on the 'Admission' page of our website.
4. Keep answers short and easy to read (max 3-4 lines if possible).
`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('GEMINI_API_KEY is missing from environment variables. Returning simulated response.');
            const simulatedText = getSimulatedResponse(message, settings, feeStructure, principals, founder, teachers);
            return res.json({ response: simulatedText });
        }

        // 3. Initialize Gemini and try models in sequence
        const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
        let responseText = null;
        let lastError = null;

        const genAI = new GoogleGenerativeAI(apiKey);

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    systemInstruction: systemInstruction
                });

                // 4. Start conversational chat with history
                const formattedHistory = (history || []).map(h => ({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.content || h.text || '' }]
                }));

                const chat = model.startChat({
                    history: formattedHistory
                });

                const result = await chat.sendMessage(message);
                responseText = result.response.text();
                if (responseText) break;
            } catch (err) {
                console.warn(`Gemini model ${modelName} call failed:`, err.message);
                lastError = err;
            }
        }

        if (responseText) {
            return res.json({ response: responseText });
        }

        console.error('All Gemini models failed. Returning simulated fallback response. Error:', lastError);
        const fallbackText = getSimulatedResponse(message, settings, feeStructure, principals, founder, teachers);
        return res.json({ response: fallbackText });
    } catch (error) {
        console.error('Chatbot Controller error:', error);
        res.status(500).json({ message: 'Error processing chatbot query: ' + error.message });
    }
};

module.exports = { getChatbotResponse };
