import { Application } from "egg";
import SMTPTransport = require("nodemailer/lib/smtp-transport");

import NodeEmail from "./lib/nodemailer";

function createNodeMailer(
  config: SMTPTransport | SMTPTransport.Options | string,
  app: Application
) {
  return new NodeEmail(config, app);
}

module.exports = (app: Application) => {
  app.addSingleton("nodemailer", createNodeMailer);
};
