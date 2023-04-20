const nodemailer = require("nodemailer");
async function addNewUserMail(name, email,password, id) {
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
      html: `<p>hii ${name}</p>,please click here to <a href="http://localhost:5000/verify?id=${id}"> Verify</a> Your mail. <b>Email:${email}<b/>  <b>Email:${password}<b/></p>`,
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
module.exports = { addNewUserMail };
