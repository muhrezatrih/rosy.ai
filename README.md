# 📈 Invest Buddy - Gemini AI API Express Server

A production-ready, secure Express.js server providing AI financial analysis, text generation, chart/image inspection, and document summarization powered by Google's official Gemini AI SDK (`@google/genai`).

---

## 🌟 Key Features

- **Text Generation (`POST /generate-text`)**: Generate financial insights, portfolio diversification advice, and investment strategies.
- **Multimodal Image Analysis (`POST /generate-from-image`)**: Analyze stock charts, candlestick patterns, and financial diagrams uploaded as image files (`.png`, `.jpg`, `.webp`, `.gif`).
- **Document Summarization (`POST /generate-from-document`)**: Extract key takeaways, financial reports summaries, and risk analyses from uploaded documents (`.pdf`, `.txt`, `.docx`).
- **Health Check Monitoring (`GET /health`)**: Endpoint returning service status, uptime, timestamp, and version for load balancer and uptime checks.
- **Security Hardened**: Protected with `helmet` HTTP headers, `cors` cross-origin control, and `express-rate-limit` rate limiting.
- **Strict File Upload Validation**: Memory storage using `multer` with a 10MB default file size limit and MIME-type white-listing.
- **Graceful Shutdown**: Traps `SIGTERM` / `SIGINT` for zero-downtime deployments.
- **Comprehensive Automated Testing**: Unit and integration test coverage powered by Jest & Supertest.
- **Containerized**: Production-ready multi-stage `Dockerfile` and non-root process user.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18.x` or higher (Tested on Node.js `v22.x`)
- npm `v9.x` or higher
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/muhrezatrih/invest-buddy.git
   cd invest-buddy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` template to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your `GEMINI_API_KEY`:
   ```env
   PORT=5001
   NODE_ENV=development
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

---

## 🏃 Running the Application

### Development Mode (Auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 🧪 Testing & Code Quality

Run the automated test suite with Jest:
```bash
npm test
```

Run ESLint checks:
```bash
npm run lint
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Content-Type |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health & uptime check | `application/json` |
| `POST` | `/generate-text` | Generate text from prompt | `application/json` |
| `POST` | `/generate-from-image` | Analyze stock chart / financial image | `multipart/form-data` |
| `POST` | `/generate-from-document` | Summarize financial report / document | `multipart/form-data` |

### Sample Request Payloads

#### 1. Text Generation (`POST /generate-text`)
```json
{
  "prompt": "Berikan analisis prinsip dasar investasi diversifikasi portofolio untuk pemula."
}
```

#### 2. Image Analysis (`POST /generate-from-image`)
Form Data fields:
- `image`: *(File - `.png`, `.jpg`, `.webp`)*
- `prompt`: *(Text, optional)* `"Analisis tren candlestick dan indikator teknikal pada grafik ini."`

#### 3. Document Analysis (`POST /generate-from-document`)
Form Data fields:
- `document`: *(File - `.pdf`, `.txt`, `.docx`)*
- `prompt`: *(Text, optional)* `"Tolong buat ringkasan laporan keuangan dan poin penting investasi dari dokumen ini."`

---

## 📮 Postman Collection

A pre-configured Postman collection is included in the project: [`invest_buddy.postman_collection.json`](./invest_buddy.postman_collection.json).

Import this file directly into Postman to quickly test all endpoints against your local server (`http://localhost:5001`).

---

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t invest-buddy:latest .
```

### Run Docker Container
```bash
docker run -d \
  -p 5001:5001 \
  -e GEMINI_API_KEY="your_actual_gemini_api_key" \
  --name invest-buddy \
  invest-buddy:latest
```

---

## 🔒 Security Best Practices

- **Zero Credential Leaks**: Secrets and `.env` files are ignored via `.gitignore` and `.dockerignore`.
- **Environment Validation**: Startup fails fast if mandatory variables like `GEMINI_API_KEY` are missing.
- **Input Sanitization & Limits**: Request body size limits and uploaded file limits prevent Memory Exhaustion / Denial-of-Service attacks.
- **Non-Root Docker Execution**: Container runs under a low-privilege `node` user.

---

## 📄 License

[MIT](LICENSE)
