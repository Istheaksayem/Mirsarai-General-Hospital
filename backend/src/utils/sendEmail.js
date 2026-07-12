import nodemailer from 'nodemailer';

/**
 * Send email using Nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email body
 */
const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_EMAIL_NAME || 'General Hospital'} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html // You can also pass HTML if needed
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
