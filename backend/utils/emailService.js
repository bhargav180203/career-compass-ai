// backend/utils/emailService.js
import nodemailer from 'nodemailer';

// Create transporter with Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // This will be App Password
    },
  });
};

// Send verification email with OTP
export const sendVerificationEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CareerCompass AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - CareerCompass AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Welcome to CareerCompass AI!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for registering with CareerCompass AI. To complete your registration, please verify your email address.</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666;">Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">This code will expire in 10 minutes</p>
              </div>
              
              <p>If you didn't create an account with CareerCompass AI, please ignore this email.</p>
              
              <p style="margin-top: 30px;">Best regards,<br><strong>The CareerCompass AI Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 CareerCompass AI. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email with OTP
export const sendPasswordResetEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CareerCompass AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - CareerCompass AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #f56565; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #f56565; letter-spacing: 8px; }
            .warning { background: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We received a request to reset your password for your CareerCompass AI account.</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666;">Your password reset code is:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">This code will expire in 10 minutes</p>
              </div>
              
              <div class="warning">
                <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
                <p style="margin: 5px 0 0 0;">If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
              </div>
              
              <p style="margin-top: 30px;">Best regards,<br><strong>The CareerCompass AI Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 CareerCompass AI. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send welcome email (after verification)
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CareerCompass AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to CareerCompass AI!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature-box { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome Aboard!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Your email has been verified successfully! Welcome to CareerCompass AI - your personal AI-powered career guidance platform.</p>
              
              <h3 style="color: #667eea; margin-top: 30px;">What you can do now:</h3>
              
              <div class="feature-box">
                <strong>🤖 Take AI Career Assessment</strong>
                <p style="margin: 5px 0 0 0; color: #666;">Discover careers that match your personality and skills</p>
              </div>
              
              <div class="feature-box">
                <strong>📊 Get Personalized Recommendations</strong>
                <p style="margin: 5px 0 0 0; color: #666;">Receive AI-powered career suggestions tailored to you</p>
              </div>
              
              <div class="feature-box">
                <strong>📝 Build Your Resume</strong>
                <p style="margin: 5px 0 0 0; color: #666;">Create professional resumes with AI assistance</p>
              </div>
              
              <div class="feature-box">
                <strong>💼 Explore Job Opportunities</strong>
                <p style="margin: 5px 0 0 0; color: #666;">Find jobs that match your career goals</p>
              </div>
              
              <p style="margin-top: 30px;">Ready to start your career journey? Login to your account and explore!</p>
              
              <p style="margin-top: 30px;">Best regards,<br><strong>The CareerCompass AI Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 CareerCompass AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email - it's not critical
    return false;
  }
};