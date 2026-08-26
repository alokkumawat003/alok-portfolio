# EmailJS delivery setup

The contact form already sends these exact template variables:

- `user_name` — visitor name
- `user_email` — visitor email address
- `message` — visitor message

Only EmailJS's public browser configuration belongs in this frontend. Never add an EmailJS private key, account password, mail-provider password, or SMTP credential.

## 1. Create the EmailJS service

1. Sign in to EmailJS.
2. Open **Email Services** and choose **Add New Service**.
3. Connect the mailbox that should receive portfolio messages.
4. Copy the generated **Service ID**. This becomes `REACT_APP_EMAILJS_SERVICE_ID`.

## 2. Create the template

1. Open **Email Templates** and create a template.
2. Set the template's recipient to Alok's receiving email address in EmailJS. The recipient address should remain in the EmailJS dashboard, not in a client-side secret.
3. Use `{{user_name}}`, `{{user_email}}`, and `{{message}}` in the subject/body as needed.
4. Set **Reply-To** to `{{user_email}}` so replies go to the visitor.
5. Copy the generated **Template ID**. This becomes `REACT_APP_EMAILJS_TEMPLATE_ID`.

## 3. Copy the public key

1. Open **Account** → **General** in EmailJS.
2. Copy the **Public Key** intended for browser integrations.
3. Use it as `REACT_APP_EMAILJS_PUBLIC_KEY`.

## 4. Configure local development

Create `frontend/.env.local` with:

```dotenv
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

`.env.local` is ignored by Git. Restart the development server after changing it.

## 5. Configure Vercel

In **Vercel Project → Settings → Environment Variables**, add all three variables:

- `REACT_APP_EMAILJS_SERVICE_ID`
- `REACT_APP_EMAILJS_TEMPLATE_ID`
- `REACT_APP_EMAILJS_PUBLIC_KEY`

Enable them for **Production** and any Preview/Development environments that should send mail. Create React App embeds `REACT_APP_*` values at build time, so redeploy after adding or changing them.

## 6. Restrict browser use

In EmailJS security settings, allow only the real production portfolio/Vercel origin. Add `http://localhost:3000` or the chosen local origin only while testing, then remove unnecessary test origins. Keep EmailJS rate limiting and abuse protection enabled.

## 7. Verify real delivery

1. Start a fresh build with the configured environment.
2. Submit a valid name, email, and message.
3. Confirm the request to `https://api.emailjs.com` returns HTTP 200.
4. Confirm the UI shows success and clears the form.
5. Confirm the message arrives in the configured recipient inbox and Reply-To points to the visitor.

The delivery feature is not considered end-to-end verified until both the HTTP 200 response and recipient inbox delivery are confirmed.
