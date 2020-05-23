import { Application } from 'egg';

import NodeEmail from './lib/nodemailer';

function createNodeMailer(config, app: Application) {
  return new NodeEmail(config, app);
}

module.exports = app => {
  app.addSingleton('nodemailer', createNodeMailer);
};
