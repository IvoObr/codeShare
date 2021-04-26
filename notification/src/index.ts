import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'ivo_obr@hotmail.com', // generated ethereal user
            pass: '....' // generated ethereal password
        }
    });

    transporter.verify(function(error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    // send mail with defined transport object
    const info: any = await transporter.sendMail({
        from: '"Fred Foo 👻" <server_api@knowhow.com>', // sender address
        to: "ivo_obr@hotmail.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello ., world?", // plain text body
        html: "<b>Hello world?</b>" // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);