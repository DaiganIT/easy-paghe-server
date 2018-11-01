import nodemailer from 'nodemailer';
import config from '../config';
import fs from 'fs';

const mailOptions = {
    from: config.mail[config.env].from, // sender address
    //to: 'bar@example.com, baz@example.com', // list of receivers
    //subject: 'Hello ✔', // Subject line
    //text: 'Hello world?', // plain text body
    //html: '<b>Hello world?</b>' // html body
};

export default class Mailer {
    static sendActivationMessage(username, activationCode) {
        let activationTemplate = fs.readFileSync('mail/activation.html', 'utf8');
        activationTemplate = activationTemplate.replace(/({{host}})/g, config.host.dev);
        activationTemplate = activationTemplate.replace(/({{activationLink}})/g, config.host.dev + '/activate/code/' + activationCode);

        mailOptions.to = config.env === 'dev' ? 'pietro.carta88@gmail.com' : username;
        mailOptions.subject = "UltimeOfferte.it - Attivazione nuovo account";
        mailOptions.html = activationTemplate;

        const transporter = Mailer.createTransporter();
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }

            if(config.env === 'dev') {
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            }
        });
    }

    static createTransporter() {
        return nodemailer.createTransport({
            host: config.mail[config.env].host,
            port: config.mail[config.env].port,
            auth: {
                user: config.mail[config.env].username,
                pass: config.mail[config.env].password
            }
        });
    }
}