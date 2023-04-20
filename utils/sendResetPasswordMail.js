const nodemailer = require("nodemailer");
async function sendResetPasswordMail(name, email,token) {
  console.log("sent mail")
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "abhishekkumar01021995@gmail.com",
        pass: "czldgichihcgwkqx",
      },
    });

    const mailOptions = {
      from: email,
      to: email,
      subject: "For Verification mail",
      html: `<p>hii ${name}</p>,please click here to <a href="http://localhost:5000/reset-password?token=${token}"> Reset Password</a> Your mail</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
module.exports = { sendResetPasswordMail };
