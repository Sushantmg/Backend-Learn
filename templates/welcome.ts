// template/welcome.ts

/**
 * Returns the HTML content for the welcome email
 * @param name - User's name
 * @param loginLink - Link to the login page
 */
export const welcomeEmailTemplate = (name: string, loginLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome Email</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
    h1 { color: #333; }
    p { color: #555; line-height: 1.5; }
    .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; }
    .footer { margin-top: 30px; font-size: 12px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to My App!</h1>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for joining our app. We are excited to have you on board! 🎉</p>
    <p>Get started by logging in and exploring our features.</p>
    <a href="${loginLink}" class="button">Login Now</a>
    <div class="footer">
      &copy; 2026 My App. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
