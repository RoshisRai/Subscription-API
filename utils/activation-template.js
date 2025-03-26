export const generateActivationEmailTemplate = ({
    name,
    activationUrl
}) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: rgb(28, 228, 228); text-align: center;">
                <p style="font-size: 54px; line-height: 54px; font-weight: 800;">Subscription API</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">                
                <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color:rgb(28, 228, 228);">${name}</strong>,</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">Thank you for signing up! Please activate your account to get started.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${activationUrl}" style="background-color: rgb(28, 228, 228); color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Activate Account</a>
                </div>
                
                <p style="font-size: 16px; margin-bottom: 25px;">Or copy and paste this link in your browser:</p>
                <p style="font-size: 14px; background-color: #f0f7ff; padding: 10px; border-radius: 4px; word-break: break-all;">${activationUrl}</p>
                
                <p style="font-size: 16px; margin-top: 25px;">This link will expire in 24 hours.</p>
                
                <p style="font-size: 16px; margin-top: 30px;">If you didn't create an account, please ignore this email.</p>
                
                <p style="font-size: 16px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The SubDub Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
                <p style="margin: 0 0 10px;">
                    SubDub Inc. | 123 Main St, Anytown, AN 12345
                </p>
                <p style="margin: 0;">
                    <a href="#" style="color: rgb(28, 228, 228); text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="#" style="color: rgb(28, 228, 228); text-decoration: none; margin: 0 10px;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</div>
`;
