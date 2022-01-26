const nodemailer = require("nodemailer");

module.exports = async (email, subject, content) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "see.event.16@gmail.com",
      pass: "kataRahasia1234",
    },
  });
  let info = await transporter.sendMail({
    from: '"SeeEvent App" <no-reply@see-event.com>',
    to: email,
    subject: subject,
    text: "",
    html: content,
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
