import nodemailer from 'nodemailer';

export const emailTemplate = (title: string, message: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 3px solid #00d0ff; border-radius: 10px;">
    <h2 style="text-align: center; color: #00aeff;">Freelance Hub</h2>
    <h3 style="color: #333;">${title}</h3>
    <p style="color: #555;">${message}</p>
    <p>Best regards,<br/>Freelance Hub Team</p>
    <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Freelance Hub. All rights reserved.</p>
  </div>
`;

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
        tls: {
            rejectUnauthorized: false, // Allows self-signed certificates
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