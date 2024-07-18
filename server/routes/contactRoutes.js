const express = require('express');
const contactRoutes = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
  
contactRoutes.post('/send-email', (req, res) => {
    const { from, subject, text } = req.body;

    const mailOptions = {
        from: from,
        to: process.env.GMAIL_USER,
        subject: subject,
        text: text,
        replyTo: from,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
  });

module.exports = contactRoutes