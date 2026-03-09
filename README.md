# wooseongjung-com

A simple, static web application utilizing Firebase Authentication and Firebase Hosting.

## 🚀 Getting Started

### 1. Prerequisites
You will need Node.js and the Firebase Command Line Interface installed on your machine.
- To install the Firebase CLI via npm:
  ```bash
  npm install -g firebase-tools
  ```

### 2. Connect Your Account
In your terminal, log in to your Firebase account to authorize deployments:
```bash
firebase login
```

---

## 🛠 Testing Locally

Before deploying your changes to the live site, it is highly recommended to test them locally on your machine.

1. **Start the local server:**
   ```bash
   firebase serve
   ```
2. **View your site:**
   Open your browser and navigate to the `Local server` address provided in the terminal (usually `http://localhost:5000`).

3. **Make Updates:**
   You can edit the `main.html` file and simply refresh the page in your browser to see your changes applied instantly.

---

## 🌐 Deploying to Production

When you are ready to push your changes to the live URL, you can deploy manually using the CLI.

1. **Deploy:**
   Ensure you are in the default project directory (`/Users/wsj/Documents/Web/wooseongjung-com`) and run:
   ```bash
   firebase deploy
   ```
2. **Access your site:**
   Once successful, your application will be live at: [https://wooseongjung-5f089.web.app/](https://wooseongjung-5f089.web.app/)

---

## 🐙 GitHub Automatic Deployments

**Current Status: NOT CONNECTED**

During the initial project setup, the connection to GitHub Actions encountered an IAM permissions error (`Service account does not exist`) from the Google Cloud Resource Manager. 

Because of this, **pushing to the GitHub repository will NOT automatically deploy to Firebase right now.**

### How to Fix GitHub Auto-Deploys
To set up continuous deployment properly:

1. Run the initialization command again specifically for GitHub:
   ```bash
   firebase init hosting:github
   ```
2. When prompted, select the existing project `wooseongjung-5f089`.
3. Provide your GitHub repository (`wooseongjung/wooseongjung-com`).
4. If the exact same IAM error occurs again, you will need to go to your [Google Cloud IAM Console](https://console.cloud.google.com/iam-admin/iam?project=wooseongjung-5f089) and ensure your user account has the necessary permissions to create Service Accounts.

---

## NS-3 Simulation Lab (Charts + Map Animation)

The `Projects -> 5G VFC Architecture Simulation` page now includes an interactive simulation lab.

### What it does

- Queues public simulation requests (1 run at a time)
- Runs NS-3 with user-controlled parameters:
  - Cars (`numVehicles`)
  - gNBs (`numGnbs`)
  - VFCs (`numVFCs` -> ns-3 `numBuses`)
  - CFNs (`numCFNs` -> ns-3 `numRsus`)
- Produces:
  - Relative velocity vs failure rate chart
  - Vehicle density vs delay chart
  - Delay component charts (absolute + share)
  - OSM tile map animation

### Start the backend API (host process)

```bash
cd /Users/wsj/Documents/Web/wooseongjung-com/sim-api
npm install
npm run dev
```

### Start API in Docker

```bash
cd /Users/wsj/Documents/Web/wooseongjung-com
cp .env.sim.example .env.sim
# adjust if needed

docker compose --env-file .env.sim -f docker-compose.sim.yml up --build
```

### Frontend development

```bash
cd /Users/wsj/Documents/Web/wooseongjung-com
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:8080`.
