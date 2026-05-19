# LeadFlow CRM

LeadFlow CRM is a professional, AI-powered CRM dashboard designed for modern sales teams. It provides deep intelligence into your sales pipeline through automated performance analysis, strategic reports, and personalized outreach recommendations.

## 🚀 Features

- **Intelligence Hub**: Generate scanned strategic performance reports powered by Gemini AI.
- **Lead Management System**: Create, track, and organize leads with dynamic status and priority management.
- **AI Insights & Suggestions**:
  - **Executive Briefs**: Contextual summaries of a lead's entire activity history.
  - **Strategic Path**: AI-recommended next best actions for optimal conversion.
  - **Outreach Assistant**: Personalized email drafting based on lead journey.
- **Analytics Dashboard**: Real-time visualization of acquisition velocity, lead attribution, and pipeline health.
- **Dynamic Owner Assignment**: Seamlessly assign leads to account executives for clear pipeline ownership.
- **AI Credits System**: Built-in usage tracking with automated refilling for a smooth development experience.
- **Report History**: Access and manage a persistent library of previously generated AI strategic reports.
- **Secure Authentication**: Robust admin authentication system powered by NextAuth.
- **Settings Management**: Centralized management of user profiles, bios, and platform preferences.
- **Toast Notifications**: Professional action-based feedback for all critical system interactions.
- **Responsive Dark SaaS UI**: Built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Engine**: [Genkit AI](https://firebase.google.com/docs/genkit)
- **Model**: [Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/)
- **Database**: [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leadflow-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_password_or_hash

   # AI Integration
   GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```
## 📁 Core Modules

- Dashboard Analytics
- Lead Management
- AI Intelligence Hub
- Report Generation
- Settings Management
- Authentication System

## 🚀 Deployment

The project is designed for seamless deployment on **Vercel**. Ensure all environment variables are configured in your Vercel project settings before deploying.
