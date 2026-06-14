# 🎬 Alight Motion Web Lite Demo

> ✨ A lightweight web-based motion graphics editor inspired by Alight Motion, built with **HTML**, **CSS**, **JavaScript**, and a **Node.js backend**.

---

# 🚀 Features

## 🔐 Authentication System

* Sign in using **Firebase Authentication**

  * 📧 Email & Password
  * 🔍 Google
  * 🐙 GitHub

* 🛡️ Built-in local authentication server acts as a fallback when Firebase services are unavailable.

---

## ☁️ Cloud Publishing

Publish your projects online and share them instantly!

### 🌍 Public Project Viewer

View shared projects using:

```text
public.html?id=PROJECT_ID
```

### 🔄 Multi-Device Sync

Use a **Render Web Service** as your cloud server.

Example:

```text
https://your-render-service.onrender.com
```

Paste the URL into the **Render Cloud URL** field to synchronize projects across multiple devices.

### 🔓 Unshare Projects

Shared projects now include an **Unshare** button for privacy control.

---

## 💬 Guest Support System

Guests attempting to access protected features will see:

```text
You are not logged in. Log in to use this feature.
```

Options available:

* 🔑 Login
* 📝 Register
* ❌ Close

---

## 🌐 Localization

* 🇻🇳 Vietnamese
* 🇺🇸 English

Additional tools:

* 🔎 Local project search
* ☁️ Cloud project search

---

# 🎵 Audio Editing

* ➕ Import multiple audio tracks simultaneously
* ▶️ Playback directly inside the timeline
* 🎚️ Layered audio workflow support

---

# ✨ Effects System

## 🌟 Halo Effect

Now includes:

* 🎨 Color adjustment
* 🔥 Hardness control
* 👻 Alpha/Transparency control

---

## 🟦 Checkerboard Effect

New **Checker / Checkerboard** effect featuring:

* 🎨 Color A / Color B
* 📐 Grid offset controls
* 🎛️ Adjustable grid size

Example:

```text
8 = 8×8 checkerboard grid
```

---

## 📂 Effect Categories

Effects are now organized into:

* 🎨 Color & Lights
* 🌫️ Blur
* 🌪️ Distortion / Warp
* 🏃 Move / Transform
* ✏️ Draw & Edge
* 🔮 Procedural
* 🎭 Matte / Mask / Key

---

## 🎭 Background Copy

Located under:

```text
Matte / Mask / Key
```

Works best when combined with:

* Gaussian Blur
* Invert Color
* Grayscale

to create advanced image-layer effects.

---

# 🎞️ Animation Improvements

## 🔑 Keyframes

* Move
* Rotate
* Scale
* Opacity

Each property now stores its own keyframe data independently.

### Benefits

✅ Better precision
✅ Easier editing
✅ No shared keyframe conflicts

---

## 📐 Raster Controls

Using Raster now unlocks:

* X Angle
* Y Angle
* Z Angle

Range:

```text
0 → 1000
```

Useful for:

* ↔️ Left / Right perspective
* ↕️ Up / Down perspective
* 🔄 2D rotation effects

---

## 🎯 Timeline Improvements

### Smoother Dragging

Timeline remains stable while dragging keyframes, reducing marker jitter.

### Navigation Buttons

Quickly jump between keyframes and markers:

```text
◄ Previous
► Next
```

### Marker Management

* 🔴 Partial Marking
* 🗑️ Delete Marking

---

# 📷 Camera System

The camera frame is hidden in new projects until:

```text
Add Camera
```

is used.

If a camera already exists:

```text
The camera frame already exists in this project.
```

will be displayed.

---

# 📝 Text Editing

### Improved Text Layer Selection

Text layers are now clearly identified when selected.

### Better Renaming

Layer names can now be completely cleared without automatically restoring old text.

---

# 🔢 OTP Experience

Verification codes now use:

```text
[ ] [ ] [ ] [ ] [ ] [ ]
```

Six separate input boxes for easier entry.

---

# 🎨 UI Builder

A new interface editor has been added.

### Components

* 🏠 Header
* 📊 Dashboard
* 🎛️ Control Blocks
* 📄 Footer

Perfect for creating custom application layouts.

---

# ▶️ Run Locally

```bash
node server.js
```

Open:

```text
http://localhost:4173/index.html
```

> ⚠️ To enable real authentication, activate Email/Password, Google, and GitHub providers in your Firebase Console.

---

# 🐳 Docker & Render Deployment

A Dockerfile is included for easy deployment.

### Build

```bash
docker build -t alight-motion-web .
```

### Run

```bash
docker run -p 4173:4173 alight-motion-web
```

The server automatically uses:

```js
process.env.PORT
```

when deployed on Render.

---

# ☁️ Using Render as Cloud Storage

### 1️⃣ Create a Render Web Service

Deploy this repository using the included Dockerfile.

### 2️⃣ Copy Your Render URL

Example:

```text
https://alight-motion-web.onrender.com
```

### 3️⃣ Connect It

Paste the URL into:

```text
Render Cloud URL
```

and click:

```text
Reload Cloud
```

### 4️⃣ Same-Origin Support

If both frontend and API are hosted on Render:

✅ No Cloud URL required.

### 5️⃣ Cross-Domain Support

CORS is already enabled for:

* Authentication API
* Cloud API

allowing multiple domains and devices to connect.

---

# 🔌 Main API Endpoints

### Authentication

```http
POST /api/auth/signup
POST /api/auth/signin
GET  /api/auth/me
```

### Projects

```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
DELETE /api/projects/:id/share
```

---

# 📧 Gmail / Outlook OTP Configuration

Set environment variables before starting the server.

```bash
export SMTP_PROVIDER=gmail
# or outlook

export SMTP_USER="your_account@gmail.com"

export SMTP_PASS="your_app_password"

export SMTP_FROM="your_account@gmail.com"

# Optional overrides

# export SMTP_HOST="smtp.gmail.com"
# export SMTP_PORT="465"
# export SMTP_SECURE="true"

node server.js
```

> 🔐 Gmail and Outlook require an **App Password** or valid SMTP credentials.

---

# ❤️ Thanks For Using Alight Motion Web Lite

Built with:

* 🌐 HTML
* 🎨 CSS
* ⚡ JavaScript
* 🚂 Node.js
* 🔥 Firebase
* ☁️ Render

Happy editing! 🎬✨

© 2026 tuanhungtran678. All Rights Reserved.
