"use strict";
const nodemailer = require("nodemailer");
const htmlCreate = require("./templates/create");
const htmlRecovery = require("./templates/recovery");

exports.send = (datas) => {
  console.log("LOG: exports.send -> datas", datas)
  const { subject, text, template } = datas
  let html = ''

  if (template.type === 'create')
    html = htmlCreate.template(subject, text, template)
  else if (template.type === 'recovery')
    html = htmlRecovery.template(subject, text, template)

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: 'ssl', // true for 465, false for other ports
      auth: {
        user: "topmilady@gmail.com", // generated ethereal user
        pass: "LabirinTop" // generated ethereal password
      }
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: '"GoGe" <topmilady@gmail.com>', // sender address
      to: "work.agents@gmail.com", // list of receivers
      subject, // Subject line
      text, // plain text body
      html // html body
    });
  }

  main().catch(console.error);
}