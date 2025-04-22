const Message = require('../models/Message');
const axios = require('axios');

exports.getChatPage = async (req, res) => {
    const messages = await Message.find().sort({ timestamp: 1 }).lean();
    res.render('index', { messages });
};

exports.handleUserMessage = async (req, res) => {
    const userMessage = req.body.message;

    // Save user message
    const userMsg = new Message({ sender: 'user', message: userMessage });
    await userMsg.save();

    // Send message to Python NLP service
    try {
        const response = await axios.post('http://localhost:5000/nlp', {
            message: userMessage
        });

        const botReply = response.data.reply;

        const botMsg = new Message({ sender: 'bot', message: botReply });
        await botMsg.save();

        res.redirect('/');
    } catch (err) {
        console.error('NLP service error:', err.message);
        const errorMsg = new Message({ sender: 'bot', message: "Sorry, I couldn't understand that." });
        await errorMsg.save();
        res.redirect('/');
    }
};
