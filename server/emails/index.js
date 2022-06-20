require("dotenv");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-handlebars");

// Step 1
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
transporter.use(
  "compile",
  hbs({
    viewEngine: "express-handlebars",
    viewPath: "./views/",
  })
);

module.exports = transporter;
