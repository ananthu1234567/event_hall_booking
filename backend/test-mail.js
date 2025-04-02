import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'sherlockmaster9@gmail.com',
  subject: 'This is a system generated email',
  text: 'If you received this email, your Nodemailer setup works!'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Email Error:', error);
  } else {
    console.log(`📩 Email sent: ${info.response}`);
  }
});
