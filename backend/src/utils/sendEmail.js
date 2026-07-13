import nodemailer from 'nodemailer';
import env from '../config/env.js';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });

  const mailOptions = {
    from: `${env.smtp.fromName} <${env.smtp.fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
