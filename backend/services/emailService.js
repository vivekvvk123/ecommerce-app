import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderConfirmationEmail = async (orderData) =>{
    const {userEmail, userName, orderId, items, totalAmount, shippingAddress} = orderData;

    const msg = {
        to: userEmail,
        from: {
            email:process.env.SENDGRID_FROM_EMAIL,
            name: 'Velvette'
        },
        subject: `Order Confirmation - ${orderId}`,
        html:
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 2px solid #007bff;">
          <h1 style="color: #007bff; margin: 0;">Velvette</h1>
          <p style="color: #666; margin: 5px 0;">Thank you for shopping with us!</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333;">Hi ${userName}!</h2>
          <p>Your order has been confirmed and will be shipped soon.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Order #${orderId}</h3>
            <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
            <p><strong>Payment Method:</strong> ${orderData.paymentMethod || 'N/A'}</p>
          </div>

          <h3>Order Items:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f1f1f1;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Size</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.size || 'N/A'}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">₹${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h3>Shipping Address:</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p style="margin: 0;">
              ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
              ${shippingAddress.street}<br>
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.pinCode}<br>
              ${shippingAddress.country}<br>
              Phone: ${shippingAddress.phone}
            </p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #e9ecef; border-radius: 8px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>What's Next?</strong><br>
              • We'll process your order within 1-2 business days<br>
              • You'll receive a shipping confirmation email once your order is dispatched<br>
              • For any questions, contact us at support@devguy.tech
            </p>
          </div>
        </div>
        
        <div style="background-color: #343a40; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Velvette. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">
            Visit us at <a href="https://velvette.devguy.tech" style="color: #007bff;">velvette.devguy.tech</a>
          </p>
        </div>
      </div>`
    };

    try{
        await sgMail.send(msg);
        // console.log('Order confirmation email sent successfully');
        return {success: true, message: 'Email sent successfully'};
    }
    catch(error){
        console.error('Error sending order confirmation email:', error);
        return {success: false, message: 'Failed to send email'};
    }

}

const sendVerificationEmail = async (userEmail, userName, otp) => {
  const msg = {
    to: userEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'Velvette'
    },
    subject: 'Email Verification',
    html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 2px solid #007bff;">
          <h1 style="color: #007bff; margin: 0;">Velvette</h1>
          <p style="color: #666; margin: 5px 0;">Welcome to Velvette!</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333;">Hi ${userName}!</h2>
          <p>Thank you for signing up with Velvette. Please verify your email address to complete your registration.</p>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h1 style="color: #007bff; font-size: 48px; margin: 0; letter-spacing: 8px;">${otp}</h1>
            <p style="color: #666; margin: 10px 0 0 0;">This verification code is valid for 10 minutes</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #d4edda; border-radius: 8px; border-left: 4px solid #28a745;">
            <p style="margin: 0; color: #155724; font-size: 14px;">
              <strong>Why verify your email?</strong><br>
              • Secure your account<br>
              • Receive order confirmations and updates<br>
              • Get exclusive offers and promotions<br>
              • Reset your password if needed
            </p>
          </div>
        </div>
        
        <div style="background-color: #343a40; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Velvette. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">
            Visit us at <a href="https://velvette.devguy.tech" style="color: #007bff;">velvette.devguy.tech</a>
          </p>
        </div>
      </div>`
  };
  try {
    await sgMail.send(msg);
    // console.log('Verification email sent successfully');
    return {success: true, message: 'Email sent successfully'};
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {success: false, message: 'Failed to send email'};
  }
}

const sendForgotPasswordEmail = async (userEmail, userName, otp) => {
  const msg = {
    to: userEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'Velvette'
    },
    subject: 'Password Reset OTP - Velvette',
    html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 2px solid #007bff;">
          <h1 style="color: #007bff; margin: 0;">Velvette</h1>
          <p style="color: #666; margin: 5px 0;">Password Reset Request</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333;">Hi ${userName}!</h2>
          <p>You requested to reset your password. Use the OTP below to reset your password:</p>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h1 style="color: #007bff; font-size: 48px; margin: 0; letter-spacing: 8px;">${otp}</h1>
            <p style="color: #666; margin: 10px 0 0 0;">This OTP is valid for 10 minutes</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Security Notice:</strong><br>
              • This OTP is valid for 10 minutes only<br>
              • Don't share this OTP with anyone<br>
              • If you didn't request this, please ignore this email
            </p>
          </div>
        </div>
        
        <div style="background-color: #343a40; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Velvette. All rights reserved.</p>
        </div>
      </div>`
  };

  try{
    await sgMail.send(msg);
    // console.log('Forgot password OTP email sent successfully');
    return {success: true, message: 'Password reset email sent successfully'};
  }
  catch(error){
    // console.error('Error sending forgot password email:', error);
    return {success: false, message: 'Failed to send password reset email'};
  }
      
}

export {sendOrderConfirmationEmail, sendVerificationEmail, sendForgotPasswordEmail};
