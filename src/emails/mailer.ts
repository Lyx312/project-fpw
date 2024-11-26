import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    // Setup email data
    const mailOptions = {
        from: `"Freelancer Hub" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: text,
        html: html,
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

export default sendEmail;