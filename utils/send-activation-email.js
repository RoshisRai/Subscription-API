import transporter, { accountEmail } from "../config/nodemailer.config.js";
import { SERVER_URL } from "../config/env.js";
import { generateActivationEmailTemplate } from "./activation-template.js";

export const sendActivationEmail = async ({ to, name, activationToken }) => {
    const mailInfo = {
        name,
        activationUrl: `${SERVER_URL}/api/v1/auth/activate/${activationToken}`
    }

    const message = generateActivationEmailTemplate(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: '🚀 Activate your Subscription API account!',
        html: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error, `Error sending email to ${to}`);

        console.log(`Email sent: ${info.response}`);
    })
}