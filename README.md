# 🏡 Rosy — AI Kost Concierge & Management System

Rosy is an AI-powered virtual concierge and room management platform designed for **Kost Ibu Ros** located in Tiban Indah, Sekupang, Batam. 

The system provides 24/7 conversational assistance for prospective and current tenants using Google's Gemini AI, combined with a real-time room availability matrix and tenant billing tracker for the property owner.

---

## 🌟 Key Features

### 1. 💬 AI Virtual Concierge (Rosy)
* **24/7 Natural Q&A**: Answers questions about room types, unfurnished room terms, inclusive water & electricity, kitchen/parking access, and monthly billing schedules.
* **Synchronized Knowledge**: Rosy's dynamic prompt is directly tied to the active room inventory database, so it never gives outdated room vacancy counts.
* **Multimodal Support**:
  * **Image Inspection**: Analyzes uploaded photos (e.g., proof of payment, maintenance/repair issues, ID cards).
  * **Document Summarization**: Reads PDF and text documents.
* **WhatsApp Escalation Routing**: Automatically routes questions needing direct owner confirmation to the owner's WhatsApp number (`+62 812-6664-1431`) with a pre-filled chat link.
* **Chat History Persistence**: Chat sessions persist locally in `localStorage` across browser refreshes with an option to reset.

### 2. 🛏️ Live Room Inventory & Tenant Management
* **Room Matrix & Stock Controls**:
  * **Kamar Kecil (5 units)**: Compact unfurnished rooms @ Rp 600.000 / month.
  * **Kamar Besar (6 units)**: Spacious unfurnished rooms @ Rp 700.000 / month.
  * **Paviliun Mandiri (1 unit)**: Private suite with ensuite bathroom & terrace @ Rp 1.500.000 / month.
* **Real-time Occupancy Matrix**: Quick toggle room status between `Kosong` (Vacant / Ready) and `Terisi` (Occupied).
* **Tenant Directory & Auto Due Dates**: Records tenant check-in dates and automatically calculates the next monthly billing due date.
* **Instant Tenant Checkout**: One-click checkout with a dedicated in-app confirmation modal that automatically frees up the room and updates the AI.

### 3. 🔐 Owner / Admin Dashboard
* **Role-Gated Access**: Discreet login for the property owner via header logo or footer access.
* **Context-Aware Interface**: Automatically hides tenant WhatsApp contact buttons when logged in as the owner, and reveals a high-visibility logout button.
* **Secured Authentication**: Protected static authentication for owner management.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, `react-markdown`, `remark-gfm`.
* **Backend**: Express.js, `@google/genai` (Gemini 2.5 Flash), Helmet security headers, CORS, Express Rate Limiter.
* **Data Storage**: Local JSON file database (`src/data/kost_db.json`) with auto-synchronization and schema fallback.
* **Testing**: Jest, Supertest.

---

## 📁 Project Structure

```text
ibukos-ai/
├── frontend/                     # Next.js 16 App Router Client
│   ├── src/
│   │   ├── app/                  # Layout, globals.css, page.tsx
│   │   ├── components/           # UI Modals, ChatMessage, Admin Dashboard, etc.
│   │   ├── data/                 # Static kost profile & contact details
│   │   └── types/                # TypeScript interfaces
│   └── package.json
│
├── src/                          # Express Backend Server
│   ├── config/                   # Environment & Dynamic Gemini Prompt Builder
│   ├── controllers/              # AI and Room controllers
│   ├── data/                     # Local JSON database (kost_db.json)
│   ├── middleware/               # Rate limiters, uploads, and error handlers
│   ├── routes/                   # AI, Health, and Room inventory API routes
│   └── services/                 # Gemini AI Service & KostDb Service
│
├── tests/                        # Automated unit & integration tests
├── .env.example
├── index.js                      # Backend entrypoint
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.x` or later (tested on `v22.x`)
* **npm**: `v9.x` or later
* **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/muhrezatrih/rosy.ai.git
cd rosy.ai
```

### 2. Configure Backend Environment
Copy the example environment file and add your Gemini API key:
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=5001
NODE_ENV=development
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 4. Run Locally

**Start Backend (Port 5001):**
```bash
npm run dev
```

**Start Frontend (Port 3000):**
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🧪 Testing

Run the automated backend test suite:
```bash
npm test
```

Build the Next.js production bundle:
```bash
cd frontend
npm run build
```

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server uptime & status check |
| `POST` | `/generate-text` | Generate AI response with live kost context |
| `POST` | `/generate-from-image` | Multimodal photo / image analysis |
| `POST` | `/generate-from-document` | PDF / text document analysis |
| `GET` | `/rooms` | Get complete inventory, categories, rooms, and tenants |
| `POST` | `/rooms/update-availability` | Quick-update available units per category |
| `POST` | `/rooms/toggle` | Toggle individual room status (`Kosong` / `Terisi`) |
| `POST` | `/tenants` | Register a new tenant with auto next due date |
| `DELETE`| `/tenants/:id` | Checkout tenant and free up room |

---

## 🔒 Security & Best Practices

* **Rate Limiting**: Protects AI endpoints against spam and denial-of-service.
* **Sanitized Uploads**: In-memory `multer` storage with strict file-type whitelisting and 10MB limits.
* **No Secret Leaks**: `.env` and credential artifacts are strictly excluded via `.gitignore`.
* **Zero AI Hallucination on Vacancies**: AI instructions are dynamically generated on every request using real-time database state.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
