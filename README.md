# Healthcare Management System

A comprehensive student healthcare management system built with Next.js and React.

## Features

- 🏥 **Medical Records Management**: Track medical history, appointments, and medications
- 👤 **User Authentication**: Secure registration and login system
- 📱 **Multi-Device Support**: Export/import data across devices
- 🔒 **Privacy First**: All data stored locally in browser
- 📊 **Dashboard Overview**: Quick stats and recent activity
- 💊 **Medication Tracking**: Monitor prescriptions and dosages
- 📅 **Appointment Scheduling**: Manage healthcare appointments

## Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. Download this project from v0
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project" → "Browse" → Upload ZIP
4. Deploy automatically
5. Get your permanent link!

### Option 2: Run Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Multi-Device Usage

1. **Export Data**: Settings tab → Export Data → Download JSON
2. **Import Data**: Settings tab → Import Data → Paste JSON
3. **Share Links**: Generate shareable URLs for instant data transfer

## Demo Credentials

For testing purposes:
- Email: demo@student.edu
- Password: demo123

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx          # Main application
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/              # shadcn/ui components
│   └── data-manager.tsx # Export/Import functionality
└── lib/
    └── utils.ts         # Utility functions
\`\`\`

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Local Storage** - Data persistence

## Deployment URLs

- **Production**: [Your Vercel URL will be here]
- **Development**: http://localhost:3000

## Support

For issues or questions, contact: [your-email@domain.com]
