import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';


export const accountEmail = 'createwithroshis.12458@gmail.com'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
})

// Verify configuration before using
transporter.verify(function(error, success) {
    if (error) {
      console.log('SMTP config error:', error);
    } else {
      console.log('Server is ready to send emails');
    }
});

export default transporter;