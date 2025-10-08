export const htmlSkeleton  = (url: string) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-spacing: 0; background-color: #f4f4f4; padding: 20px 0;">
                <tr>
                    <td align="center">
                        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Verify Your Email Address</h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px; color: #333333;">
                                    <h2 style="color: #333333; font-size: 24px; margin-top: 0;">Hello, User!</h2>
                                    <p style="line-height: 1.6; font-size: 16px; color: #555555; margin: 16px 0;">Thank you for signing up! We're excited to have you on board.</p>
                                    <p style="line-height: 1.6; font-size: 16px; color: #555555; margin: 16px 0;">To complete your registration and ensure the security of your account, please verify your email address by clicking the button below:</p>
                                    
                                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="${url}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">Verify Email Address</a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="line-height: 1.6; font-size: 16px; color: #555555; margin: 16px 0;">This verification link will expire in 24 hours.</p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; color: #888888; font-size: 14px;">
                                    <p style="margin: 0 0 10px 0;">If you have any questions, please contact us at <a href="mailto:support@example.com" style="color: #667eea; text-decoration: none;">support@example.com</a></p>
                                    <p style="margin: 10px 0;">&copy; 2025 Your Company. All rights reserved.</p>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>`;
}