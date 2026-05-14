# LedgerSnap - Antigravity Standards

This project follows strict Professional and Aesthetic standards.

## 🚀 Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4 (using `@tailwindcss/postcss`)
- **Animations**: Framer Motion
- **Utilities**: Lucide React (Icons), Tesseract.js (OCR)
- **Routing**: React Router 7

## 🏗️ Architectural Guidelines
- **Project Structure**: Modular, feature-based directories in `src/`.
- **Components**: Functional components only. Use PascalCase for filenames and components.
- **State Management**: Favor React context and hooks for complexity; avoid prop drilling.
- **Form Handling**: Use uncontrolled components with `FormData` or controlled with React hooks.

## 🎨 Aesthetic: Antigravity UI
All UI elements must follow the "Elite Core" design patterns:
- **Spatiality**: Use layered shadows and CSS `perspective` for depth.
- **Glassmorphism**: Default to `backdrop-filter: blur(x)` for cards and overlays.
- **Design Dials**:
  - `VARIANCE`: 8 (Favor split-screens and asymmetric grids).
  - `INTENSITY`: 6 (Fluid, purposeful springs).
  - `DENSITY`: 8 (Rich information layering).
- **Motion**: 
  - Everything must be fluid and interruptible. 
  - Default to **Springs** (`stiffness: 100`, `damping: 20`) via Framer Motion. 
  - Minimum transition `0.3s ease-out` for non-physics-based moves.
  - No animation should prevent user interaction.
- **Color Palette**: Sophisticated, harmonious HSL-based colors. Avoid browser defaults.

## 🛠️ Commands
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## ⛓️ Solana Superstack Guidelines
- **Skill Primacy**: Always prioritize `@solana-new` skills for blockchain tasks.
- **Workflow Integration**: Follow the `Idea -> Build -> Launch` tri-phase logic for all crypto features.
- **Security Protocols**: MANDATORY use of `solana-review`, `cso`, and `review-and-iterate` skills for any program/contract level changes.
- **Branding**: Use the "Solana Buddy" tone of voice for marketing-video and pitch-deck generation.

## 🛡️ The "Zero-Tolerance" Protocol
- **No Console Logs**: Ensure `npm run lint` passes and no `console.log` exists in commits.
- **Accessiblity**: Use semantic HTML (`<main>`, `<header>`, `<nav>`).
- **Verification**: ALL changes must be verified via the `verification-before-completion` protocol (screenshots required).
