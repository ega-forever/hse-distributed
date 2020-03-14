import * as nodemailer from 'nodemailer';
import config from '../config';

class MailService {

  public transporter: any;

  constructor() {
    // tslint:disable:object-literal-sort-keys
    this.transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secureConnection: config.mail.secureConnection,
      service: config.mail.service,
      auth: {
        user: config.mail.user,
        pass: config.mail.password
      }
    });
  }

  public async send(args): Promise<void> {
    const options = {
      ...args,
      from: config.mail.user
    };

    await new Promise((res, rej) =>
      this.transporter.sendMail(options, (err, info) => {
        err ? rej(err) : res(info);
      })
    );
  }
}

export default MailService;
