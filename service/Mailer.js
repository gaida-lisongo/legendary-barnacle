const nodemailer = require('nodemailer');

class Mailer {
    constructor( auth) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: auth,
            pool: true,
            maxConnections: 10,
            maxIdleTime: 10000
        }, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log(info);
            }
        });

        this.content = '';
    }

    makeContent(stringHtml) {
        this.content = stringHtml;
    }

    sendMail(to, subject, from) {
        try {
            const mail = this.transporter.sendMail({
                from: from,
                to: to,
                subject: subject,
                html: this.content
            });

            return {
                success: true,
                message: 'Mail sent successfully',
                data: mail
            };
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Mail sending failed',
                error: error
            };
        }
    }
}

module.exports = Mailer;
