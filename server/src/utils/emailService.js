import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:5000/api/auth/verify-email/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Blood Donation System',
    html: `
      <h2>Welcome to Blood Donation System</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Blood Donation System',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for registering as a blood donor. Your contribution can save lives.</p>
      <h3>Next Steps:</h3>
      <ul>
        <li>Complete your profile</li>
        <li>Set your availability status</li>
        <li>Explore blood requests in your area</li>
      </ul>
    `
  };
  
  await transporter.sendMail(mailOptions);
};