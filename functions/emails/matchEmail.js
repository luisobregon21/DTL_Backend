const nodemailer = require('nodemailer')
// this is for sending the email

exports.sendMatchEmail = async (
    sendEmailTo,
    user1,
    user2,
    zoomCredentials,
    user2Email
) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dtl.downtolearn@gmail.com',
            pass: 'downtolearnC15',
        },
    })
    const options = {
        from: 'dtl.downtolearn@gmail.com',
        to: sendEmailTo,
        subject: 'It is a Match!',
        text: `Hi ${user1}, you have a new match with ${user2}! Get in touch soon!
        
        The Zoom link: ${zoomCredentials.url},
        The Zoom passcode: ${zoomCredentials.passcode}

        Note: This link is a one time use, please contact eachother to connect.

        ${user2} email is: ${user2Email}.

        Thank you for using DTL.

        Always down to learn,
        DTL
        `,
    }
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.error(err)
            return
        }
        console.log('Email has been sent')
    })
}
