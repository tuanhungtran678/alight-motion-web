# Alight Motion Web Lite Demo

**Alight Motion Web Lite** runs using pure HTML/CSS/JS + Node server.

## New Features
- OTP Sign-in will send a real email via SMTP (Gmail/Outlook). If SMTP is not configured, the application will clear the error.

- Local failover authentication when the API is not running (no more common `auth_failed` error).

- Login via email to verify existence + 6-digit OTP via email (with security warning).

- **Real** login using email/password with the API server (`/api/auth/signup`, `/api/auth/signin`, `/api/auth/me`).

- Cloud Publish: publish the project to the server, view it publicly via `public.html?id=...`.

- **Cloud Server URL** field allows multiple machines to point to a single server => cloud synchronization between machines.

- If your Cloud project will have an **Unshare** button to unshare.

- Customer support (guests) with method warnings:
- `You are not logged in. Log in to use this feature.`
- `Login`, `Register`, and `X` buttons to close.

- Added language change (VI/EN), local and cloud project search.

- Insert multiple audio tracks simultaneously and play them back in a timeline.

- Halo effect now includes color, hardness, and alpha adjustments.

- Text Layer is specified when selecting text.

- Enter OTP in 6 separate blocks for easier input.

- New interface editor (title/dashboard/control support blocks).

- Added Header and Footer to the interface.

## Run Locally
``` bash
node server.js
```
Open: `http://localhost:4173/index.html`

## Main API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `DELETE /api/projects/:id/share`
- `GET /api/projects/:id`

## Configure OTP sending to Gmail/Outlook
Set up environment variables before running `node server.js`:

``` bash
export SMTP_PROVIDER=gmail # or Outlook
export SMTP_USER="your_account@gmail.com"
export SMTP_PASS="your_app_password"
export SMTP_FROM="your_account@gmail.com"
# override option
# export SMTP_HOST="smtp.gmail.com"
# export SMTP_PORT="465"
# export SMTP_SECURE="true"
server.js button
```

> For Gmail/Outlook, you need to use your App Password or valid SMTP information for your main account.
