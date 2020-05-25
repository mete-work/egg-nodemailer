import { Singleton } from 'egg';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import Mail = require('nodemailer/lib/mailer');

import NodeEmail from './lib/nodemailer';

declare module 'egg' {
  interface NodeMailer extends Singleton<NodeEmail>, NodeEmail {
    get(id: string): NodeEmail;
  }

  interface Application {
    nodemailer: NodeMailer;
  }

  interface EggAppConfig {
    nodemailer: {
      client: SMTPTransport | SMTPTransport.Options;
      clients?: {
        [key: string]: SMTPTransport | SMTPTransport.Options;
      };
    };
  }
}

export interface NodeMailerOptions extends Mail.Options {
  htmlTemplateName?: string;
  htmlTemplateData?: object;
  htmlTemplateDir?: string;
}
