# egg-nodemailer

`egg-nodemailer` 是一个基于 [nodemailer](https://nodemailer.com/) 的 egg plugin。

## 如何使用

### 配置

要使用插件请在 `config/plugin` 文件下配置该插件：

```js
// {app_root}/config/plugin.js
nodemailer: {
  enable: true,
  package: '@mete-work/egg-nodemailer',
},
// 注意，egg-nodemailer依赖 egg-view-ejs 插件，请务必安装
// 否则将会启动失败
ejs: {
  enable: true,
  package: 'egg-view-ejs',
},
```

配置，同 `nodemailer.createTransport` 函数入参：

```js
// {app_root}/config/config.xxx.js
nodemailer: {
    client: {
      host: 'smtp.exmail.mete.work',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
          user: 'reply@mete.work',
          pass: 'password'
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    },
},
// 配置 egg-view 插件启用 ejs 模板引擎
view: {
    mapping: {
      '.ejs': 'ejs',
    },
}
```

如果需要配置多 client，请参考下面示例：

```js
// {app_root}/config/config.xxx.js
nodemailer: {
    clients: {
      a: {
          host: 'smtp.exmail.mete.work',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
              user: 'reply@mete.work', // generated ethereal user
              pass: 'password' // generated ethereal password
          },
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
          }
        },
      b: {
        host: 'smtp.exmail.mete.work',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'reply@mete.work', // generated ethereal user
            pass: 'password' // generated ethereal password
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      },
    },
},
```

### 使用 nodemailer

`egg-nodemailer` 插件将 `NodeEmail` 对象挂载到 `Application` 对象上，挂载的属性名为 `nodemailer`。即可通过 `this.app.nodemailer` 获取。如果是多 `clients` ，请通过 `this.app.nodemailer.get(key)` 来获取 `NodeEmail` 对象。

`NodeEmail` 暴露了两个常用接口用于邮件操作：

#### sendMail(options)

发送邮件

options 为一个对象，对象具有的属性为：

| 参数        | 类型                                             | 备注                                                                  |
| ----------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| mailOptions | NodeMailerOptions                                | 邮件配置项，具体配置可查看 ts 定义文件                                |
| transport   | Mail                                             | 可选，SMTP transport 对象，未赋值时，将会根据 nodemailer 配置自动创建 |
| config      | SMTPTransport \| SMTPTransport.Options \| string | 可选，SMTP 连接配置项，未赋值时，将会取 nodemailer 配置               |
| defaults    | SMTPTransport.Options                            | 可选，SMTP transport options                                          |

返回：

| 字段    | 类型   | 备注           |
| ------- | ------ | -------------- |
| content | string | 发送的邮件内容 |
| result  | any    | 邮件发送结果   |

温馨提示：

`egg-nodemailer` 内置邮件模板支持，模板文件统一放置在 `html-template` 文件夹下。模板默认使用 ejs 模板引擎。如需使用模板，需要在 `mailOptions` 中配置 `htmlTemplateName` 和 `htmlTemplateData` 两个字段。

**htmlTemplateName**： 即模板名称，如 `weekly.ejs` 。

**htmlTemplateData**：即 ejs 模板数据。

#### creatTransport

创建 SMTP connection 对象。

形参：

| 参数     | 类型                                             | 备注                                                                    |
| -------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| config   | SMTPTransport \| SMTPTransport.Options \| string | 可选，SMTP transport 邮箱服务器配置项，未赋值时，将会取 nodemailer 配置 |
| defaults | SMTPTransport.Options                            | 可选，SMTP transport options                                            |

返回：

Mail 对象

#### verify

验证 SMTP 邮件服务器配置是否有效。如果正常，则返回 `true`，否则返回 `Error` 错误对象。参考https://nodemailer.com/smtp/#verify-smtp-connection-configuration

形参：

| 参数      | 类型 | 备注                                                                  |
| --------- | ---- | --------------------------------------------------------------------- |
| transport | Mail | 可选，SMTP transport 对象，未赋值时，将会根据 nodemailer 配置自动创建 |

返回：

Promise<true>

## 示例

Controller:

```js
	// 多实例
	async multMail() {
    this.ctx.body = (await this.app.nodemailer.get('a').sendMail({
      mailOptions:{
        from: 'reply@mete.work',
        to: 'reply@mete.work',
        subject: '[周报][godotdotdot][2019/08/19 ~ 2019/08/23]',
        htmlTemplateName: 'weekly.ejs',
        htmlTemplateData: {
          user: 'godotdotdot',
          startDate: new Date().toLocaleDateString(),
          endDate: new Date().toLocaleDateString(),
          projects: [
            {
              name: 'Mete Work',
              content: `<p>Mete Work</p>`,
            },
          ],
          technology: [],
          jjyy: `JJWW`,
      },}
    })).content;
  }
	// 单实例
  async singleMail() {
    this.ctx.body = (await this.app.nodemailer.sendMail({
      mailOptions: {
        from: 'reply@mete.work',
        to: 'reply@mete.work',
        subject: '[周报][godotdotdot][2019/08/19 ~ 2019/08/23]',
        htmlTemplateName: 'weekly.ejs',
        htmlTemplateData: {
          user: 'godotdotdot',
          startDate: new Date().toLocaleDateString(),
          endDate: new Date().toLocaleDateString(),
          projects: [
            {
              name: 'Lucifer 原型图',
              content: `<p>Lucifer 研发流程平台原型图产出</p>`,
            },
          ],
          technology: [],
          jjyy: `这里是叽叽歪歪`,
        },
      }
    })).content;
  }

	// 使用其他 transport 邮箱服务器配置
  async create() {
    const transport = this.app.nodemailer.createTransport({
      host: 'smtp.exmail.mete.work',
      port: 465,
      secure: true,
      auth: {
        user: 'reply@mete.work',
        pass: 'password',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.ctx.body = (await this.app.nodemailer.sendMail({
      mailOptions: {
        from: 'reply@mete.work',
        to: 'reply@mete.work',
        subject: '[周报][godotdotdot][2019/08/19 ~ 2019/08/23]', // Subject line
        htmlTemplateName: 'weekly.ejs',
        htmlTemplateData: {
          user: 'godotdotdot',
          startDate: new Date().toLocaleDateString(),
          endDate: new Date().toLocaleDateString(),
          projects: [
            {
              name: 'Mete Work',
              content: `<p>Mete Work</p>`,
            },
          ],
          technology: [],
          jjyy: `JJWW`,
      },
      transprot,
    }})).content;
  }

```
