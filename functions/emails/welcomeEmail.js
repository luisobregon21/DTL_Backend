const nodemailer = require('nodemailer')
// this is for sending the email

exports.sendEmail = async (sendEmailTo) => {
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
        subject: 'Welcome to DTL',
        text: 'We are happy you are part of the DTL family!',
    }
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.error(err)
            return
        }
        console.log('Email has been sent')
    })
}
