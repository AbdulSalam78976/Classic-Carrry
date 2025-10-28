# Classic Carry - Netlify Deployment Guide

## Email Configuration Setup

### 1. Update Email Addresses
Before deploying, update the email addresses in `netlify.toml`:

```toml
# Company email for receiving orders
to = ["your-company-email@domain.com"]

# Auto-responder emails
subject = "Order Confirmation - Your Company Name"
```

### 2. Netlify Forms Configuration

The website uses Netlify Forms for:
- **Order submissions** (`order-form`)
- **Contact form** (`contact-form`)

### 3. Email Notifications

Two types of email notifications are configured:

#### For Company (Order Notifications):
- **To**: `orders@classiccarry.com` (update this)
- **Subject**: "New Order Received - Classic Carry"
- **Content**: Full order details, customer info, delivery address

#### For Customers (Order Confirmation):
- **To**: Customer's email address
- **Subject**: "Order Confirmation - Classic Carry"
- **Content**: Order summary, delivery info, next steps

### 4. Deployment Steps

1. **Update Email Addresses**:
   - Edit `netlify.toml` with your actual email addresses
   - Update contact information in `contact.html`

2. **Deploy to Netlify**:
   - Connect your repository to Netlify
   - Netlify will automatically detect the forms
   - Forms will be available in Netlify dashboard

3. **Test the Forms**:
   - Place a test order
   - Check Netlify dashboard for form submissions
   - Verify email notifications are working

### 5. Form Features

#### Order Form Features:
- ✅ Customer email collection
- ✅ Complete delivery information
- ✅ Order items and totals
- ✅ Free delivery calculation
- ✅ Spam protection (honeypot)
- ✅ Automatic email confirmations

#### Contact Form Features:
- ✅ Customer inquiries
- ✅ Support requests
- ✅ Spam protection

### 6. File Structure

```
├── checkout.html          # Main order form
├── order-success.html     # Order confirmation page
├── contact.html           # Contact form
├── netlify.toml          # Netlify configuration
├── _redirects            # URL redirects
└── assets/js/main.js     # Form handling logic
```

### 7. Important Notes

- **No WhatsApp Integration**: Orders are now processed via email
- **Cart Persistence**: Cart is cleared after successful order
- **Form Validation**: Client-side validation before submission
- **Success Handling**: Automatic redirect to success page
- **Error Handling**: User-friendly error messages

### 8. Customization

To customize email templates, edit the `body` sections in `netlify.toml`:

```toml
body = """
Your custom email template here...
Use {{fieldName}} for form field values
"""
```

### 9. Testing

1. Add items to cart
2. Go to checkout
3. Fill in all required fields
4. Submit order
5. Check for:
   - Redirect to success page
   - Email to customer
   - Email to company
   - Form submission in Netlify dashboard

### 10. Support

For Netlify Forms documentation: https://docs.netlify.com/forms/setup/