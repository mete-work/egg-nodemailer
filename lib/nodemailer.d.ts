/// <reference types="node" />
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import Mail = require('nodemailer/lib/mailer');
import { NodeMailerOptions } from '..';
import { Application } from 'egg';
export default class NodeEmail {
    private config;
    private app;
    constructor(config: SMTPTransport | SMTPTransport.Options | string, app: Application);
    getConfig(): string | SMTPTransport | SMTPTransport.Options;
    getApp(): Application;
    /**
     * 发送邮件
     * @param mailOptions 邮件配置项
     * @param transport 可选，SMTP transport 对象，未赋值时，将会根据 nodemailer 配置自动创建
     * @param config 可选，SMTP 连接配置项，未赋值时，将会取 nodemailer 配置
     * @param defaults 可选，SMTP transport options
     * @return object { content: 邮件内容, result: 邮件发送结果 }
     */
    sendMail({ mailOptions, transport, config, defaults, }?: {
        mailOptions: NodeMailerOptions;
        transport?: Mail;
        config?: SMTPTransport | SMTPTransport.Options | string;
        defaults?: SMTPTransport.Options;
    }): Promise<{
        content: string | Buffer | import("stream").Readable | Mail.AttachmentLike;
        result: any;
    }>;
    /**
     * 创建 SMTP transport
     * @param config 可选，SMTP transport 邮箱服务器配置项，未赋值时，将会取 nodemailer 配置
     * @param defaults 可选，SMTP transport options
     */
    createTransport(config?: SMTPTransport | SMTPTransport.Options | string, defaults?: SMTPTransport.Options): Mail;
    /**
     * 验证 SMTP 邮件服务器配置是否可用
     * @param _transport 可选，SMTP transport 对象，未赋值时，将会根据 nodemailer 配置自动创建
     */
    verify(_transport?: Mail): Promise<true>;
}
