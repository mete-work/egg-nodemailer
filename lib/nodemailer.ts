import nodemailer = require('nodemailer');
import juice = require('juice');

import SMTPTransport = require('nodemailer/lib/smtp-transport');
import Mail = require('nodemailer/lib/mailer');

import fs = require('fs');
import path = require('path');
import util = require('util');

import { NodeMailerOptions } from '..';
import { Application } from 'egg';

const readFile = util.promisify(fs.readFile);

export default class NodeEmail {
  private config: SMTPTransport | SMTPTransport.Options | string;
  private app: Application;

  constructor(
    config: SMTPTransport | SMTPTransport.Options | string,
    app: Application,
  ) {
    this.config = config;
    this.app = app;
  }

  getConfig() {
    return this.config;
  }

  getApp() {
    return this.app;
  }

  /**
   * 发送邮件
   * @param mailOptions 邮件配置项
   * @param transport 可选，SMTP transport 对象，未赋值时，将会根据 nodemailer 配置自动创建
   * @param config 可选，SMTP 连接配置项，未赋值时，将会取 nodemailer 配置
   * @param defaults 可选，SMTP transport options
   * @return object { content: 邮件内容, result: 邮件发送结果 }
   */
  async sendMail(
    {
      mailOptions,
      transport,
      config,
      defaults,
    }: {
      mailOptions: NodeMailerOptions;
      transport?: Mail;
      config?: SMTPTransport | SMTPTransport.Options | string;
      defaults?: SMTPTransport.Options;
    } = { mailOptions: {} },
  ) {
    const _transport =
      transport || this.createTransport(config || this.config, defaults);
    const options = mailOptions;

    const {
      htmlTemplateName,
      htmlTemplateData,
      text,
      htmlTemplateDir,
    } = options;

    let html;

    if (htmlTemplateName) {
      html = await readFile(
        htmlTemplateDir
          ? path.join(htmlTemplateDir, htmlTemplateName)
          : path.join(__dirname, '../html-template', htmlTemplateName),
        'utf8',
      );
      html = juice(html);

      const ctx = this.app.createAnonymousContext();
      html = await ctx.renderString(html, htmlTemplateData, {
        viewEngine: 'ejs',
      });

      options.html = html;
    }

    return {
      content: html || text,
      result: await _transport.sendMail(options),
    };
  }

  /**
   * 创建 SMTP transport
   * @param config 可选，SMTP transport 邮箱服务器配置项，未赋值时，将会取 nodemailer 配置
   * @param defaults 可选，SMTP transport options
   */
  createTransport(
    config?: SMTPTransport | SMTPTransport.Options | string,
    defaults?: SMTPTransport.Options,
  ) {
    const transport = nodemailer.createTransport(
      config || this.config,
      defaults,
    );

    return transport;
  }

  /**
   * 验证 SMTP 邮件服务器配置是否可用
   * @param _transport 可选，SMTP transport 对象，未赋值时，将会根据 nodemailer 配置自动创建
   */
  verify(_transport?: Mail) {
    const transport = _transport || this.createTransport();
    return transport.verify();
  }
}
