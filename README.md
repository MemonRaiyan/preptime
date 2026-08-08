# FMGE MASTER 🩺

**"Everything you need to prepare for FMGE, in one free and open-source platform."**

Welcome to the **FMGE Master** repository! This is a 100% free, open-source, and community-driven ecosystem designed specifically for the Foreign Medical Graduate Examination (FMGE). We believe medical education should be accessible to everyone without paywalls, premium tiers, or hidden fees.

## 🌟 Core Principles

1. **Free Forever:** No subscriptions, no payment gateways, no premium content. The entire platform is built around free education.
2. **Open-Source:** The codebase is open for the community to inspect, improve, and deploy.
3. **FMGE Only:** Laser-focused strictly on FMGE requirements. No NEET, JEE, or UPSC clutter.
4. **Legal & Ethical Content:** We do not host pirated materials. We integrate with verified, open-access, and public domain resources.

## 🚀 Features

- **Personalized Dashboard:** Track progress, XP, and streaks.
- **Smart Notes & Flashcards:** SuperMemo-2 spaced repetition integrated.
- **AI Tutor:** Context-aware AI assistant utilizing local and open-source models for RAG.
- **Grand Test Simulator:** Full 300 MCQ simulation with analytics.
- **Mistake Notebook:** Categorize and review errors efficiently.
- **Clinical Case Vignettes:** Practice high-yield clinical scenarios.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL (Supabase) + pgvector for RAG
- **State Management:** React Context API

## 💻 Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fmge-master/fmge-master.git
   cd fmge-master
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file and add necessary keys (e.g., Supabase URL, AI API keys).

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🤝 Contributing

We welcome contributions from developers, doctors, and students! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
