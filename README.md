# Decentralized Degree Vault — Frontend

React web app for a blockchain-backed academic credential system. Registrars issue degrees, graduates keep them in a private vault, and anyone can check a degree's authenticity in seconds.

> Final Year Project, Mehran University of Engineering & Technology (MUET), Jamshoro.
> Backend: [Blockchain-based-Degree-verification-system](https://github.com/yahyaCodeX/Blockchain-based-Degree-verification-system)

---

## Contents

- [Pages](#pages)
- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [How it connects to the backend](#how-it-connects-to-the-backend)
- [Project structure](#project-structure)
- [Design notes](#design-notes)
- [Team](#team)

---

## Pages

| Route | For | What it does |
|---|---|---|
| `/` | Everyone | Landing page with quick verification, an interactive tamper demo, and how the system works |
| `/verify` | Employers, public | Verify by university and roll number, credential ID, or QR link |
| `/student` | Graduates | PIN-protected vault: view, print, and share the diploma |
| `/admin` | Registrars | Issue degrees (single or CSV + ZIP batch), search the ledger, revoke degrees |

## Highlights

- **"Try to forge it" demo** – visitors edit a sample diploma and watch its SHA-256 fingerprint change live. It uses the same canonical format as the backend, hashed in the browser with the Web Crypto API.
- **Animated verification** – the lookup, recompute, and compare steps tick off. The diploma is then revealed with a gold seal, or stamped **VOID** if the record was tampered with.
- **Clear result states** – authentic, tampered, incomplete, revoked, and not found each have their own explanation.
- **Printable diploma** – prints as exactly one A4 landscape page with a scan-to-verify QR code.
- **Sharing** – a public verification link and an *Add to LinkedIn* shortcut.
- **Registrar dashboard** – single and batch issuance, live batch progress, a searchable ledger, and revocation with a reason.
- **VaultAI assistant** – a floating chat helper that can look up and explain verification results.
- **Light and dark themes** – the diploma itself always stays ivory.
- **Responsive and accessible** – works on phones and respects the *reduce motion* setting.

## Tech stack

| Area | Technology |
|---|---|
| Framework | React 19, TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 with theme tokens, Fraunces and Inter fonts |
| Animation | Framer Motion |
| Routing | React Router 7 |
| HTTP | Axios |
| Uploads | react-dropzone |
| Icons | lucide-react |

## Getting started

### Prerequisites

- Node.js 20.19 or newer
- The backend running on `http://localhost:8081`

### Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

To test from a phone on the same network, expose the dev server:

```bash
npm run dev -- --host
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |

## How it connects to the backend

All API calls use the relative base path `/api/v1` ([`src/services/api.ts`](src/services/api.ts)).

- **Development:** Vite proxies `/api` to `http://localhost:8081` ([`vite.config.js`](vite.config.js)).
- **Production:** serve `dist/` behind a web server that forwards `/api` to the backend.
- **HTTPS:** serve the site over HTTPS. The forge demo and copy-to-clipboard need a secure browser context, which `localhost` counts as.

Registrar and student sessions use JWTs returned by the backend. If a registrar's session expires, they are asked to sign in again.

## Project structure

```
src/
├── components/
│   ├── common/      VaultAI chatbot, theme switcher
│   ├── dashboard/   Registrar login, issuance form, batch upload, ledger
│   ├── diploma/     Shared parchment, gold seal and VOID stamp
│   ├── home/        Forge demo and animated "how it works"
│   ├── layout/      App shell, navigation, footer
│   ├── ui/          Buttons, cards, badges
│   └── verify/      Search form, processing steps, result views
├── context/         Auth and theme providers
├── data/            Participating universities
├── pages/           Home, Verify, Student vault, Admin dashboard
└── services/        Typed API client
```

## Design notes

- Colours are CSS variables in [`src/index.css`](src/index.css) for each theme, mapped to Tailwind utilities.
- Headings use **Fraunces**, body text uses **Inter**, and hashes use **JetBrains Mono**.
- One diploma component ([`components/diploma/Parchment.tsx`](src/components/diploma/Parchment.tsx)) renders every diploma: the demo, verification results, and the student vault.

## Team

| Name | Roll No. | Role |
|---|---|---|
| M. Yahya | 22CS001 | Lead developer |
| Muzzamil | 22CS073 | Developer |
| Mansoor | 22CS075 | Developer |

Mehran University of Engineering & Technology, Jamshoro
