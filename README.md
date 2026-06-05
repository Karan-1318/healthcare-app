Student Healthcare Tracker
A local-first, client-side web application built with Next.js 14 to help students track clinic visits, medical logs, and prescription schedules.

Because the app is designed with absolute data privacy in mind, it requires zero backend database setup. All data is managed locally right in the user's browser.

🛠️ Tech Stack
Framework: Next.js 14 (App Router)

Language: TypeScript

Styling: Tailwind CSS & shadcn/ui

Storage: Web Storage API (Local Storage)

Deployment: Vercel

✨ Key Features
Complete Privacy: Zero-knowledge architecture. No health records or personal data are ever uploaded to an external server.

Dashboard Overview: Quick-glance widgets displaying upcoming clinic appointments, active medication dosages, and health logs.

Data Portability (Import/Export): Easily bypass the lack of a cloud database by exporting your entire profile into a structured JSON file, allowing you to back up your data or paste it into another device to sync up.

Demo Mode: Built-in mock credentials to let users test the dashboard experience instantly without needing an enrollment setup.

🚀 Getting Started
Prerequisites
Make sure you have Node.js installed on your machine.

Local Installation
1. Clone the repository and navigate into the project folder:
git clone https://github.com/Karan-1318/healthcare-app.git
cd healthcare-app

2. **Install the project dependencies:**
   ```bash
npm install

3. Fire up the local development server:
npm run dev

4. **Open your browser** and navigate to `http://localhost:3000`.

### 🔑 Live Demo Access

To skip manual data entry and instantly preview the populated layout, log in using the following test credentials:

* **Email:** `demo@student.edu`
* **Password:** `demo123`

## 🔄 How Data Sync Works

Since there is no backend server, syncing between your laptop and mobile phone is completely manual and file-based:

1. **To Backup:** Go to the Settings tab, click **Export Data**, and save the generated JSON file.
2. **To Restore:** Open the app on your other device, go to Settings, click **Import Data**, and paste the JSON payload to load your dashboard state.
