const nodemailer = require('nodemailer');

class Mailer {
    constructor( host, port, secure, auth) {
        this.transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure,
            auth: auth
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
