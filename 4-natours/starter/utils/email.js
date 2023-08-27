const nodemailer = require('nodemailer');

const sendEmail = async options => {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Erika Mello <erika@erika.io>',
    to: options.email,
    subjet: options.subject,
    text: options.message,
    // html
  };

  await transporter.sendMail(mailOptions) 
}

module.exports = sendEmail