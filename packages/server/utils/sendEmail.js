const nodemailer = require("nodemailer");

/**
 * Send an email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version of the email
 * @param {string} [options.html] - HTML version of the email (optional)
 * @throws {Error} If email sending fails or if required fields are missing
 * @returns {Promise<void>}
 */
const sendEmail = async (options) => {
    // Validate required fields
    if (!options.email || !options.subject || !options.text) {
        throw new Error(
            "Missing required email fields: email, subject, and text are required"
        );
    }

    try {
        // Create transporter with error handling for missing env variables
        if (
            !process.env.EMAIL_HOST ||
            !process.env.EMAIL_PORT ||
            !process.env.EMAIL_USER ||
            !process.env.EMAIL_PASS
        ) {
            throw new Error(
                "Missing email configuration in environment variables"
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Set up email options
        const mailOptions = {
            from:
                process.env.EMAIL_FROM ||
                "KEEP-NOTES-MONOREPO <hello@keepnotes.io>",
            to: options.email,
            subject: options.subject,
            text: options.text, // Plain text body
            html: options.html || options.text.replace(/\n/g, "<br>"), // HTML body (fallback to text with line breaks)
        };

        // Send email and await result
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;
