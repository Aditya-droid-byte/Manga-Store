const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "**REMOVED**",
    pass: "**REMOVED**",
  },
});

module.exports = transporter;
