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

exports.announce = (req, res) => {
  console.log(">>mailer/announce");

  const { meeting, recipients } = req.body;

  for (const recipient of recipients) {
    readHTMLFile("./mails/announcement.html", async (err, html) => {
      let template = handlebars.compile(html);
      let replacements = {
        content: meeting?.content,
        title: meeting.title,
        appName: process.env.APP_NAME,
      };
      let htmlToSend = template(replacements);
      let msg = {
        from: `${process.env.APP_NAME} Team <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject: `${meeting.title} - ${new Date(
          meeting.date
        ).toLocaleString()}`,
        html: htmlToSend,
        attachments: [
          {
            filename: "logo.png",
            path: "./assets/logo.png",
            cid: "aplogo",
          },
        ],
      };

      try {
        await transporter.sendMail(msg);
        console.log(">>mailer/announce - announcement sent");
      } catch (error) {
        console.log(">>mailer/announce - announcement error");
        console.log(error.message);
      }
    });
  }

  res.json({ status: true, message: "Meeting announced successfully" });
};
