import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: `"E-Commerce" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,    // use html property here
    };

    try {
        console.log("Sending email to:", to);
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send email", error };
    }
};

