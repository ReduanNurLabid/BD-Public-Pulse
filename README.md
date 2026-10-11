# 🇧🇩 BD Public Pulse | বাংলাদেশ রাজনৈতিক আদর্শ মূল্যায়ন

<p align="center">
  <img src="public/android-chrome-192x192.png" alt="BD Public Pulse Logo" width="100" />
</p>

<p align="center">
  <strong>An empirical, transparent, and bilingual Political Compass and real-time Public Opinion Dashboard tailored for Bangladeshi politics and civil society.</strong>
</p>

<p align="center">
  <a href="https://politicalcompass.web.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Visit_Live_Platform-politicalcompass.web.app-059669?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Platform" />
  </a>
</p>

<p align="center">
  <a href="https://politicalcompass.web.app/" target="_blank"><img src="https://img.shields.io/badge/Live%20App-politicalcompass.web.app-brightgreen.svg?logo=firebase" alt="Live Demo" /></a>
  <a href="https://github.com/ReduanNurLabid/BD-Public-Pulse/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/React-18-61dafb.svg?logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646cff.svg?logo=vite" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-ffca28.svg?logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Language-Bangla%20%7C%20English-green.svg" alt="Bilingual" />
</p>

> 🔗 **Live Web Application:** [https://politicalcompass.web.app](https://politicalcompass.web.app/)  
> Experience the full 24-question political assessment, discover your historical leader alignment, and explore the real-time public opinion dashboard live.

---

## 📖 Overview

**BD Public Pulse** is an interactive, civic-tech web application that enables citizens to discover where their political beliefs stand across a calibrated 2-dimensional ideological spectrum specifically formulated for Bangladesh's socioeconomic context.

Beyond individual assessment, the platform aggregates anonymous citizen inputs in real time into an interactive **Public Pulse Dashboard**, uncovering shifting national sentiments on key governance, economic, and reform issues.

---

## ✨ Key Features

- **🎯 Contextualized 24-Question Assessment**:
  - 8 thematic blocks covering secularism vs. religious values, state-led vs. market economics, constitutional reform, judicial independence, federal devolution, foreign policy non-alignment, and digital civil liberties.
  - Multi-point Likert scale with balanced polarities to prevent agreement bias.

- **🧭 2D Ideological Compass (`-10` to `+10`)**:
  - **Horizontal Axis (X)**: Economic Policy (Left: Socialist/Welfare State $\leftrightarrow$ Right: Market Capitalism/Private Enterprise).
  - **Vertical Axis (Y)**: Governance & Social Order (Top: Libertarian/Pluralist/Decentralized $\leftrightarrow$ Bottom: Communitarian/Traditionalist/State Authority).

- **🏛️ Political Bloc & Historical Figure Matching**:
  - Euclidean distance matching against major political factions and philosophical traditions in Bangladesh.
  - Alignment score with curated iconic historical thinkers and national/world leaders (e.g., Maulana Bhashani, H.S. Suhrawardy, Tajuddin Ahmad, Abraham Lincoln, Nelson Mandela, etc.).

- **📊 Live Real-Time Dashboard**:
  - Live visitor count with heartbeat presence detection.
  - Aggregated national distribution across quadrants, age brackets, regional divisions, and occupations.
  - Wedge issue tracker displaying public consensus and polarization metrics.

- **🎨 Shareable 9:16 Social Cards & Certificates**:
  - Generates high-fidelity, downloadable Instagram Story/Facebook-ready cards (`html2canvas` / PDF export).
  - Includes user coordinates, dominant quadrant, top historical match, and unique verification stamp.

- **🌐 Bilingual & Modern UI**:
  - Full support for both **Bangla (বাংলা)** and **English**.
  - Built with custom dark mode and light mode, zero-flash theme persistence, fluid responsive design, and accessible typography (Inter, Tiro Bangla, Noto Sans Bengali).

- **🛡️ Privacy & Anti-Tamper Guarantees**:
  - Fully anonymous participation — no personal identifiers or account registrations required.
  - Client-side fingerprinting and session hashing to prevent ballot stuffing without compromising anonymity.
  - Constant-time $O(1)$ Firestore aggregation schema to protect against distributed denial-of-service and minimize database read costs.

---

## 🛠️ Tech Stack

- **Live Deployment**: [Firebase Hosting (politicalcompass.web.app)](https://politicalcompass.web.app/)
- **Framework**: [React 18](https://react.dev/)
- **Bundler & Dev Server**: [Vite 5](https://vitejs.dev/)
- **Database & Cloud**: [Google Firebase](https://firebase.google.com/) (Firestore, App Check, Cloud Functions, Analytics)
- **Data Visualization**: [Recharts](https://recharts.org/) & Custom SVG Canvas
- **Card Generation**: [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://github.com/parallax/jsPDF)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Modern Vanilla CSS Design System with CSS variables and glassmorphic elevation tokens

---

## 📂 Project Structure

```text
BD-Public-Pulse/
├── public/                 # Static assets, favicon suite, leader portraits, manifest
│   ├── countries/flags/    # Country flag icons for international comparative figures
│   └── personalities/      # Calibrated historical leader portraits
├── scratch/                # Verification, simulation, backfill & tuning scripts
├── src/
│   ├── assets/             # Brand vector logos and political bloc emblems
│   ├── components/         # Modular React UI components
│   │   ├── CompassChart.jsx        # 2D Canvas coordinate visualizer
│   │   ├── Dashboard.jsx           # Real-time national aggregate analytics
│   │   ├── DemographicsForm.jsx    # Optional demographic survey
│   │   ├── MethodologyPage.jsx     # Transparent scoring & dataset docs
│   │   ├── PersonalityCard.jsx     # Historical leader match card
│   │   ├── ResultScreen.jsx        # Complete score breakdown & radial charts
│   │   ├── ResultsCollage.jsx      # Exportable 9:16 social media card
│   │   ├── TestScreen.jsx          # Interactive 40-question survey runner
│   │   └── WelcomePage.jsx         # Landing page and live stats badge
│   ├── data/
│   │   └── questions.js            # 40 questions, thematic blocks & bloc baselines
│   ├── hooks/                      # Custom React hooks (theme, viewport, etc.)
│   ├── lib/
│   │   ├── aggregateMath.js        # O(1) atomic increment math for Firestore
│   │   ├── firebase.js             # Firebase client SDK initialization & queries
│   │   ├── scoring.js              # Vector normalization & affinity algorithms
│   │   └── visitorSession.js       # Device session & anti-duplication hashing
│   ├── App.jsx                     # Top-level view router and state coordinator
│   ├── index.css                   # Core design tokens, dark/light themes, utilities
│   └── main.jsx                    # React DOM entry point
├── firestore.rules         # Granular Firestore security and rate-limiting rules
├── firebase.json           # Firebase Hosting and deployment configuration
├── package.json            # Dependencies and npm scripts
└── vite.config.js          # Vite build pipeline configuration
```

---

## 🚀 Getting Started

### Live Visit

You can try the live application immediately without local setup:
👉 **[https://politicalcompass.web.app](https://politicalcompass.web.app/)**

### Local Development Setup

#### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

#### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ReduanNurLabid/BD-Public-Pulse.git
   cd BD-Public-Pulse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and add your keys (optional for local mock mode):
   ```bash
   cp .env.example .env
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Available Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Launch local Vite development server with HMR |
| `npm run build` | Compile optimized production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run verify:scoring` | Validate math formulas and vector boundaries |
| `npm run verify:stats` | Check demographic age-bucket calculation consistency |
| `npm run verify:live-stats` | Test concurrent presence listener behavior |
| `npm run verify:wedge-issues` | Verify polarization metric bounds on contentious issues |
| `npm run backfill:stats` | Administrative script to backfill aggregates (requires service key) |

---

## 📊 Theoretical Framework & Methodology

For detailed documentation on question weights, polarities, and ideological baselines, please refer to the in-app **Methodology Page** or review [`src/lib/scoring.js`](src/lib/scoring.js).

1. **Axes Formulation**:
   - Scores on each question range from `1` (Strongly Disagree) to `5` (Strongly Agree).
   - Polarities are applied ($+1$ or $-1$) according to theoretical positioning.
   - Total scores are normalized to a standard Cartesian plane $[-10, +10] \times [-10, +10]$.

2. **Bloc and Personality Affinities**:
   - Calculated via normalized inverse Euclidean distance:
     $$\text{Affinity}(u, p) = \max\left(0, 1 - \frac{d(u, p)}{d_{\max}}\right) \times 100\%$$
   - Personality profiles are calibrated across both economic and governance axes.

---

## 🔒 Security & Privacy Notice

- **No Personal Identifiable Information (PII)**: The application does not collect names, phone numbers, email addresses, IP addresses, or browser histories.
- **Client Session Isolation**: Fingerprints are hashed client-side with salted timestamps and used solely to prevent automated spam submissions.
- **Firestore Security Rules**: Strict schema validation ensures incoming assessment writes cannot modify existing documents, tamper with aggregate counters, or inject arbitrary payloads.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
