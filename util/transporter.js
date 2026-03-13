const nodemailer = require('nodemailer');

const username = process.env.transporterUser;
const password = process.env.transporterPassword;
console.log("Username: "+ username + " "+ "Password: "+ password);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: username,
    pass: password,
  },
});

module.exports = transporter;
