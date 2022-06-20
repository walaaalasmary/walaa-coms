require("dotenv").config();
const transporter = require("./index");
const log = console.log;

function sendEmail(faculty, cb) {
  let mailOptions = {
    from: process.env.EMAIL,
    to: faculty.email,
    subject: "Account created",
    template: "create-account",
    context: {
      name: faculty.firstName,
      username: `${faculty.email}`,
      password: `${faculty.password}`,
      url: `${process.env.SERVER_URL}/login`,
    },
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.error(`[email] ${err}`);
      console.error(`[email]`, mailOptions);
      return cb(err);
    }
    log(`[email] reset password for ${faculty.email}`);
    return cb(null, data);
  });
}
module.exports = sendEmail;
