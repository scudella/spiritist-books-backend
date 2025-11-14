import nodemailer from 'nodemailer';
import nodemailerConfig from './nodemailerConfig.js';

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return await transporter.sendMail({
    from: '"Spiritist Books" <info@scudella.net.br>', // sender address
    to,
    subject,
    html,
  });
};

export default sendEmail;
