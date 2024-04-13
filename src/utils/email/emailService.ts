import { Application } from '@feathersjs/feathers';
import {createTransport, Transporter} from 'nodemailer';
import logger from '../../logger';

interface mailOptions {
  to: string,
  subject: string,
  text?: string, 
  html?: string,
  cc?: string | Array<string>, 
  bcc?: string|Array<string>, 
  attachments?: {
    filename?: string | false | undefined,
    content?: string | Buffer | undefined,
    path?: string | undefined,
    contentType?: string | undefined,
  }[]
}
export class EmailService {
  app: Application;
  transporter: Transporter;

  constructor(app: Application) {
    this.app = app;
    this.transporter = createTransport({
      service: app.get('smtp').service,
      host: app.get('smtp').host,
      port: app.get('smtp').port,
      requireTLS: true,
      auth: {
        user: app.get('smtp').user,
        pass: app.get('smtp').pass
      }
    });
  }

  //common method to send mail extend interface when needing more control over sending mail
  async sendMail(mailOptions: mailOptions
  ){

    //sending mail 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.transporter.sendMail(mailOptions,(err: Error| null, info : any)=>{
      if(err){
        //log if error
        logger.log('error',`Mail not send for this configuration${mailOptions} `);
      }
    });
  }


}
