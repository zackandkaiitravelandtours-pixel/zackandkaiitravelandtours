# EmailJS Setup Guide for Travel Agency Website

## 🚨 IMPORTANT: Service ID Not## Step 5: Update Website Configuration
1. Open the file: `config.json`
2. Find the `emailjs` section at the bottom of the file
3. Replace the placeholder values with your actual credentials:

```json
"emailjs": {
  "serviceID": "service_abc123",     // Replace with your Service ID from Step 2
  "publicKey": "user_xyz789",        // Replace with your Public Key from Step 4
  "templates": {
    "inquiry": "template_inquiry",   // Keep exactly as is
    "booking": "template_booking"    // Keep exactly as is
  }
}
```x

The error you're seeing indicates that the service ID `'service_n3vd9tq'` doesn't exist in your EmailJS dashboard yet. You need to create it first.

## Step-by-Step Setup Instructions

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Add Email Service
1. Log in to your EmailJS dashboard: https://dashboard.emailjs.com/admin
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended for testing)
4. Follow the authentication steps for your email provider
5. **Important:** After creating the service, you'll get a Service ID like `service_abc123`
6. **Copy this Service ID - you'll need it for step 5**

### 3. Create Email Templates
You need to create exactly 2 templates with these specific IDs:

#### Template 1: General Inquiry Template
1. In your EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. **Set Template ID as:** `template_inquiry` (exactly this)
4. Set Template Name as: "Travel Inquiry"
5. Use this template content:

**Subject:** `New Travel Inquiry from {{from_name}}`

**Body:**
```
Hello {{to_name}},

You have received a new travel inquiry:

From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}

Submitted on: {{timestamp}}

Please respond to this inquiry as soon as possible.

Best regards,
Travel Agency Website
```

#### Template 2: Booking Request Template
1. Create another template with **Template ID:** `template_booking` (exactly this)
2. Set Template Name as: "Booking Request"
3. Use this template content:

**Subject:** `Booking Request: {{subject}}`

**Body:**
```
Hello {{to_name}},

You have received a new booking request:

{{message}}

Please contact the customer within 24 hours.

Best regards,
Travel Agency Website
```

### 4. Get Your Public Key
1. In your EmailJS dashboard, go to "Account" → "General"
2. Find your "Public Key" (it looks like: `user_abc123xyz`)
3. Copy this key

### 5. Update Website Configuration
1. Open the file: `js/script.js`
2. Find the `EMAIL_CONFIG` object (around line 1726)
3. Replace the placeholder values with your actual credentials:

```javascript
const EMAIL_CONFIG = {
    serviceID: 'service_abc123', // Replace with YOUR Service ID from Step 2
    publicKey: 'user_xyz789',    // Replace with YOUR Public Key from Step 4
    templates: {
        inquiry: 'template_inquiry', // Keep exactly as is
        booking: 'template_booking'  // Keep exactly as is
    }
};
```

### 6. Test the Setup
1. Save your changes to `script.js`
2. Refresh your website
3. Try submitting a contact form or booking request
4. Check your email for the messages

## Method 2: PHP Backend (For server hosting)

If you have a PHP server, you can use the included `send-email.php` script.

### Setup Steps:

1. **Configure PHP Script**
   - Open `send-email.php`
   - Update the configuration section:
   ```php
   $config = [
       'admin_email' => 'your-admin-email@domain.com', // Your admin email
       'admin_name' => 'Your Travel Agency Admin',
       'company_name' => 'Your Travel Agency Name',
       // ... other settings
   ];
   ```

2. **Upload to Server**
   - Upload `send-email.php` to your website's root directory
   - Ensure PHP mail() function is enabled on your server

3. **Test Email Functionality**
   - Submit a test inquiry through your website
   - Check your admin email for the inquiry

## Method 3: Advanced SMTP (For production use)

For production websites, use SMTP with PHPMailer:

1. **Install PHPMailer**
   ```bash
   composer require phpmailer/phpmailer
   ```

2. **Configure SMTP Settings**
   - Update the `send-email.php` configuration:
   ```php
   'use_smtp' => true,
   'smtp_host' => 'smtp.gmail.com',
   'smtp_port' => 587,
   'smtp_username' => 'your-email@gmail.com',
   'smtp_password' => 'your-app-password',
   ```

3. **Enable SMTP Code**
   - Uncomment the PHPMailer code in the `sendEmailSMTP` function

## Method 4: Third-party Services

### Using Formspree (No coding required)
1. Go to [https://formspree.io/](https://formspree.io/)
2. Create an account and get your form endpoint
3. Update your form action:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Using Netlify Forms (For Netlify hosting)
1. Add `data-netlify="true"` to your form tag
2. Deploy to Netlify
3. Netlify will handle form submissions automatically

## Testing Your Setup

1. **Open Browser Developer Tools**
   - Go to your website
   - Open browser console (F12)
   - Check for any error messages

2. **Submit Test Inquiry**
   - Fill out the contact form
   - Submit it
   - Check for success/error notifications

3. **Verify Email Receipt**
   - Check your admin email inbox
   - Look for the inquiry email
   - Verify all form data is included

## Troubleshooting

### EmailJS Issues:
- Verify your service ID, template IDs, and public key
- Check EmailJS dashboard for usage limits
- Ensure templates use correct variable names ({{from_name}}, {{from_email}}, etc.)

### PHP Issues:
- Ensure PHP mail() function is enabled
- Check server error logs
- Verify email headers are properly formatted
- Test with a simple PHP mail script first

### General Issues:
- Check browser console for JavaScript errors
- Verify form field names match the script expectations
- Ensure all required fields are properly validated

## Security Considerations

1. **Rate Limiting**: Implement rate limiting to prevent spam
2. **Validation**: Always validate and sanitize form inputs
3. **CAPTCHA**: Consider adding CAPTCHA for production use
4. **SSL**: Ensure your website uses HTTPS
5. **Backup**: Keep logs of all inquiries for backup

## Admin Panel Features

The website includes a local admin panel (visible on localhost) that shows:
- Recent inquiries stored in browser localStorage
- Copy inquiry details to clipboard
- Clear inquiry history

This helps with testing and provides a backup of form submissions.

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify your email service configuration
3. Test with simple form submissions first
4. Consider using a third-party service like Formspree for simplicity

Remember to replace all placeholder values (YOUR_SERVICE_ID, your-email@domain.com, etc.) with your actual configuration details!