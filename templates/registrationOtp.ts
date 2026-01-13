// templates/registrationOtp.ts

/**
 * Returns the HTML content for the registration OTP email
 * @param name - User's name
 * @param otp - One Time Password
 * @param expiryMinutes - OTP expiry time in minutes
 */
export const registrationOtpTemplate = (
  name: string,
  otp: number,
  expiryMinutes: number = 10
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 {
      color: #333;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
    .otp-box {
      margin: 20px auto;
      padding: 15px;
      font-size: 28px;
      letter-spacing: 6px;
      font-weight: bold;
      background-color: #f0f0f0;
      border-radius: 6px;
      display: inline-block;
      color: #000;
    }
    .warning {
      color: #d9534f;
      font-size: 14px;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Email Verification</h1>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Thank you for registering with us.  
      Please use the OTP below to verify your email address.
    </p>

    <div class="otp-box">${otp}</div>

    <p>
      This OTP is valid for <strong>${expiryMinutes} minutes</strong>.
    </p>

    <p class="warning">
      Do not share this OTP with anyone.
    </p>

    <div class="footer">
      &copy; 2026 My App. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
