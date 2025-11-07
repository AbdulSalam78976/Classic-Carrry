# Email Notification Setup Instructions

## Overview

Your website now uses **dual form submission** to send emails to both the business owner and customers when orders are placed.

## How It Works

### 1. Two Separate Forms

- **Owner Notification Form**: `owner-order-notification` - Sends detailed order info to business
- **Customer Confirmation Form**: `customer-order-confirmation` - Sends confirmation to customer

### 2. Automatic Submission

When a customer places an order, both forms are submitted automatically with different data:

**Owner Form Contains:**

- Customer name, email, phone
- Full delivery address
- Complete order details
- Order total and date
- High priority flag

**Customer Form Contains:**

- Customer's email address
- Personalized confirmation message
- Order summary
- Next steps information

## Netlify Dashboard Setup

### Step 1: Configure Owner Notifications

1. Go to **Netlify Dashboard** → **Forms** → **owner-order-notification**
2. Click **Settings & Usage**
3. Add **Email Notifications**:
   - **Email to notify**: `your-business-email@domain.com`
   - **Subject**: `🛍️ NEW ORDER RECEIVED - Classic Carry`
   - **Custom email template**: Use the form data to create your notification

### Step 2: Configure Customer Confirmations

1. Go to **Netlify Dashboard** → **Forms** → **customer-order-confirmation**
2. Click **Settings & Usage**
3. Add **Email Notifications**:
   - **Email to notify**: `{{email}}` (this uses the customer's email from the form)
   - **Subject**: `✅ Order Confirmation - Classic Carry`
   - **Custom email template**: Use `{{message}}` field which contains the full confirmation

### Step 3: Email Templates

#### Owner Email Template:

```
🛍️ NEW ORDER RECEIVED

Customer: {{customerName}}
Email: {{customerEmail}}
Phone: {{customerPhone}}
Address: {{deliveryAddress}}

Order Details:
{{orderItems}}

Total: {{orderTotal}}
Date: {{orderDate}}

⚡ Action Required: Contact customer to confirm order
```

#### Customer Email Template:

```
{{message}}
```

(The message field contains the complete formatted confirmation)

## Benefits of This Approach

✅ **Separate Customization**: Different email content for owner vs customer
✅ **Reliable Delivery**: Uses Netlify's built-in form handling
✅ **No External Dependencies**: No need for third-party email services
✅ **Easy Management**: Configure everything in Netlify Dashboard
✅ **Automatic Processing**: Both emails sent simultaneously

## Testing

1. Place a test order on your website
2. Check that you receive the owner notification
3. Check that the customer receives their confirmation
4. Verify all order details are correct in both emails

## Troubleshooting

- **Forms not appearing in dashboard**: Make sure to deploy the updated code first
- **Emails not sending**: Check spam folders and verify email addresses in Netlify settings
- **Missing data**: Check browser console for any JavaScript errors during form submission

## Form Names in Netlify

- `owner-order-notification` - For business notifications
- `customer-order-confirmation` - For customer confirmations
- `contact-form` - For contact page (existing)
