# Email Troubleshooting Guide - Classic Carry

## **Issue: Not Receiving Emails from Netlify Forms**

### **Step 1: Check Netlify Dashboard**

1. Go to your Netlify site dashboard
2. Click **"Forms"** in the left sidebar
3. Look for:
   - `order-form`
   - `contact-form`

**If forms are NOT listed:**
- Forms weren't detected during build
- Redeploy your site
- Check that hidden detection forms exist in HTML

**If forms ARE listed but show 0 submissions:**
- Forms aren't submitting properly
- Check JavaScript console for errors
- Test form submission

**If forms show submissions but no emails:**
- Email notifications aren't configured properly
- Continue to Step 2

### **Step 2: Check Email Configuration**

In your `netlify.toml`, verify:

```toml
[[notifications]]
  type = "email"
  event = "submission-created"
  form = "order-form"
  to = ["mrdj78976@gmail.com"]  # ← Your email here
```

### **Step 3: Common Email Issues**

#### **A. Gmail Spam/Promotions Folder**
- Check **Spam** folder
- Check **Promotions** tab in Gmail
- Check **All Mail** folder

#### **B. Email Delivery Delays**
- Netlify emails can take 5-15 minutes
- Try waiting longer after test submission

#### **C. Email Address Typos**
- Verify `mrdj78976@gmail.com` is correct
- No extra spaces or characters

#### **D. Netlify Email Limits**
- Free plan: 100 form submissions/month
- Check if you've exceeded limits

### **Step 4: Test Process**

1. **Submit Test Order:**
   - Add items to cart
   - Go to checkout
   - Fill form with YOUR email
   - Submit order

2. **Check Netlify Dashboard:**
   - Go to Forms → order-form
   - Should see new submission
   - Click on submission to see data

3. **Check Email:**
   - Wait 10-15 minutes
   - Check all Gmail folders
   - Look for emails from Netlify

### **Step 5: Alternative Solutions**

#### **Option A: Use Netlify Identity + Functions**
More complex but more reliable email delivery

#### **Option B: Use External Email Service**
- EmailJS
- Formspree
- SendGrid

#### **Option C: Simple Email Forwarding**
Just get form data, no fancy emails:

```toml
[[notifications]]
  type = "email"
  event = "submission-created"
  form = "order-form"
  to = ["mrdj78976@gmail.com"]
  subject = "New Order"
  body = "Check Netlify dashboard for details"
```

### **Step 6: Debug Information**

When testing, check:

1. **Browser Console** (F12):
   - Any JavaScript errors?
   - Form submission successful?

2. **Network Tab** (F12):
   - Form POST request successful?
   - Response status 200?

3. **Netlify Deploy Log**:
   - Forms detected during build?
   - Any build errors?

### **Step 7: Contact Netlify Support**

If still not working:
1. Go to Netlify dashboard
2. Click "Support" 
3. Provide:
   - Site name
   - Form name
   - Test submission timestamp
   - Expected email address

## **Quick Test Commands**

### **Test 1: Manual Form Submission**
```html
<!-- Simple test form -->
<form name="test" method="POST" data-netlify="true">
  <input type="email" name="email" value="mrdj78976@gmail.com">
  <button type="submit">Test</button>
</form>
```

### **Test 2: Check Form Detection**
Look for this in Netlify build log:
```
Forms detected in deploy
- order-form
- contact-form
```

### **Test 3: Verify Email Template**
Check `netlify.toml` syntax:
- No missing quotes
- Proper TOML formatting
- Valid email addresses

## **Most Common Solutions**

1. **Redeploy site** after adding forms
2. **Check spam folder** in Gmail
3. **Wait 15 minutes** for email delivery
4. **Verify email address** spelling
5. **Check Netlify dashboard** for submissions first

## **Emergency Backup Plan**

If emails never work, you can:
1. Check Netlify Forms dashboard daily
2. Download form submissions as CSV
3. Process orders manually
4. Set up phone notifications instead