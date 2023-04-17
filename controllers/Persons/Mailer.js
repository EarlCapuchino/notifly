const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let readHTMLFile = (path, cb) =>
  fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
    if (err) {
      throw err;
    } else {
      cb(null, html);
    }
  });

exports.sendCode = (req, res) =>
  readHTMLFile("./mails/code.html", (err, html) => {
    let template = handlebars.compile(html);
    let replacements = {
      code: req.body.code,
      message: req.body.message,
      username: req.body.username,
      appName: process.env.APP_NAME,
    };
    let htmlToSend = template(replacements);
    let msg = {
      from: `${process.env.APP_NAME} Team <${process.env.EMAIL_USER}>`,
      to: req.body.to,
      subject: req.body.subject,
      html: htmlToSend,
      attachments: [
        {
          filename: "logo.png",
          path: "./assets/logo.png",
          cid: "aplogo",
        },
      ],
    };
    transporter
      .sendMail(msg)
      .then(() => res.json({ message: "Email sent successfully." }))
      .catch(err => res.json({ message: err }));
  });
