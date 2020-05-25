"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("./lib/nodemailer"));
function createNodeMailer(config, app) {
    return new nodemailer_1.default(config, app);
}
module.exports = (app) => {
    app.addSingleton("nodemailer", createNodeMailer);
};
