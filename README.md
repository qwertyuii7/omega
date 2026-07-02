# Obsidian Reserve - Executive Admin Suite

A modern SaaS enterprise administration platform engineered with high-performance responsive layouts, real-time product management interfaces, telemetry analytics, and role-based access enforcement. Designed with aesthetics inspired by Linear, Notion Analytics, Stripe Dashboard, and Vercel.

**Live Production Deployment:** [https://client-gamma-orcin.vercel.app](https://client-gamma-orcin.vercel.app)

---

## Key Features

### 1. Responsive Admin Dashboard Architecture
- **Sidebar & Top Navigation**: Collapsible navigation pane tailored for desktop, tablet, and mobile viewports with active route indicator lighting.
- **Header Telemetry Bar**: Live system search, real-time notification alerts, and active session clearance badge.
- **User Profile Drawer**: Instant inspection of session telemetry, clearance level, and rapid termination/logout actions.

### 2. Product Management Interface
- **Dynamic Grid & List Viewports**: Toggle between structured tabular data rows and executive visual product cards.
- **Comprehensive Filtering & Search**: Instant debounced search query processing paired with category sorting and inventory threshold filters.
- **Detailed Product Specifications**: Modal inspection of unit pricing, SKU cryptography, stock availability, and historical sales velocity.
- **Live State Mutations**: Create new products, update inventory allocations, and delete deprecated stock items directly from the interface.

### 3. Executive Analytics & Telemetry Engine
- **Revenue & Conversion Metrics**: High-contrast metric cards tracking Gross Merchandise Value (GMV), active sessions, and net profit margins.
- **Time-Horizon Slicing**: Dynamically shift data visualization between 7-Day, 30-Day, 90-Day, and Annual telemetry horizons.
- **Interactive Data Visualization**: Clean SVG graph representations engineered without third-party chart bloat.

### 4. Role-Based Access Enforcement (RBAC)
- **Executive Admin Mode**: Full read/write capabilities, inventory mutations, and system configuration access.
- **Standard User Mode**: View-only enforcement preventing unauthorized catalogue mutations or inventory adjustments.

### 5. Dual Contrast Visual Themes
- **Obsidian Dark Suite**: High-contrast glassmorphic dark interface optimized for low-eye-strain executive environments.
- **Alabaster White Theme**: Crisp daytime executive light viewport featuring high-legibility slate typography.

---

## Technology Stack

- **Core**: React 18, Vite 8, JavaScript (ESNext)
- **Styling Architecture**: Vanilla CSS variables integrated with Tailwind CSS utility engine
- **Typography & Icons**: Google Material Symbols Outlined, Inter / Outfit Display fonts
- **Deployment & Hosting**: Vercel Edge Network with SPA client-side routing rewrites

---

## Getting Started

### Prerequisites
- Node.js version 18.0 or higher
- npm package manager

### Installation & Local Execution

1. Clone the repository and navigate into the workspace:
```bash
git clone https://github.com/qwertyuii7/omega.git
cd omega/client
```

2. Install dependencies:
```bash
npm install
```

3. Launch the local development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

4. Build for production evaluation:
```bash
npm run build
```

---

## Demonstration Access Credentials

The application provides pre-filled demonstration profiles on the authentication screen:
- **Executive Admin**: `admin@obsidian.corp` (Pass: `ObsidianExec2026!`)
- **Standard User**: `user@obsidian.corp` (Pass: `ObsidianUser2026!`)
