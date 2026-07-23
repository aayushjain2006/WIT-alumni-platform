const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise} Nodemailer send result
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"${process.env.COLLEGE_NAME} Alumni Platform" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Send Welcome Email
 * @param {Object} user - User object
 */
const sendWelcomeEmail = async (user) => {
  const subject = `Welcome to the ${process.env.COLLEGE_NAME} Alumni Platform!`;
  const html = `
    <h1>Welcome, ${user.firstName}!</h1>
    <p>We are thrilled to have you join the ${process.env.COLLEGE_NAME} Alumni Engagement Platform.</p>
    <p>Connect with peers, discover opportunities, and stay engaged with your alma mater.</p>
    <br/>
    <p>Best Regards,</p>
    <p>${process.env.COLLEGE_NAME} Alumni Association</p>
  `;
  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send Password Reset Email
 * @param {Object} user - User object
 * @param {string} resetToken - Reset token string
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <p>Hello ${user.firstName},</p>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
    <p>This link is valid for 10 minutes.</p>
  `;
  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send Event Reminder Email
 * @param {Object} user - User object
 * @param {Object} event - Event object
 */
const sendEventReminderEmail = async (user, event) => {
  const subject = `Reminder: Upcoming Event - ${event.title}`;
  const html = `
    <p>Hi ${user.firstName},</p>
    <p>This is a reminder for the upcoming event: <strong>${event.title}</strong>.</p>
    <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
    <p>Location: ${event.location}</p>
    <br/>
    <p>We look forward to seeing you there!</p>
  `;
  return sendEmail({ to: user.email, subject, html });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEventReminderEmail
};
