# URL Shortener

A secure and scalable URL Shortener application built using Node.js, Express, MongoDB, and React. This project supports both auto-generated short links and custom personalized URLs with proper validation and collision prevention.

---

## 🏗 System Architecture (v1.0)

<div class="arch-canvas">
  <div class="arch-title">URL Shortener — v1.0 System Architecture</div>
  <svg width="820" height="540" viewBox="0 0 820 540" xmlns="http://www.w3.org/2000/svg" font-family="IBM Plex Mono, monospace">
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8"/>
      </marker>
      <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#2563eb"/>
      </marker>
      <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#16a34a"/>
      </marker>
      <marker id="arrow-orange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#ea580c"/>
      </marker>
    </defs>

    <!-- USER -->
    <rect x="340" y="20" width="140" height="60" rx="10" fill="white" stroke="#e0ddd6" stroke-width="1.5"/>
    <text x="410" y="44" text-anchor="middle" font-size="20">🌐</text>
    <text x="410" y="62" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">User / Browser</text>
    <text x="410" y="76" text-anchor="middle" font-size="9" fill="#888">HTTP Client</text>

    <line x1="410" y1="80" x2="410" y2="118" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)" stroke-dasharray="4,3"/>
    <text x="420" y="104" font-size="9" fill="#2563eb">POST /shorten</text>
    <text x="420" y="116" font-size="9" fill="#16a34a">GET /{code}</text>

    <!-- API GATEWAY -->
    <rect x="290" y="120" width="240" height="60" rx="10" fill="#f8faff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="410" y="144" text-anchor="middle" font-size="18">🔀</text>
    <text x="410" y="162" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">API Gateway</text>
    <text x="410" y="176" text-anchor="middle" font-size="9" fill="#888">Routes requests to services</text>

    <line x1="290" y1="150" x2="185" y2="215" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="215" y="192" font-size="9" fill="#888">POST</text>

    <line x1="410" y1="180" x2="410" y2="218" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="416" y="204" font-size="9" fill="#888">GET</text>

    <line x1="530" y1="150" x2="635" y2="215" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="575" y="192" font-size="9" fill="#888">fire & forget</text>

    <!-- SHORTENER SERVICE -->
    <rect x="60" y="220" width="180" height="70" rx="10" fill="#fff7ed" stroke="#ea580c" stroke-width="1.5"/>
    <text x="150" y="245" text-anchor="middle" font-size="18">⚙️</text>
    <text x="150" y="264" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">Shortener Service</text>
    <text x="150" y="280" text-anchor="middle" font-size="9" fill="#888">ID Gen + Base62 encode</text>

    <!-- REDIRECT SERVICE -->
    <rect x="290" y="220" width="240" height="70" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
    <text x="410" y="245" text-anchor="middle" font-size="18">↪️</text>
    <text x="410" y="264" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">Redirect Service</text>
    <text x="410" y="280" text-anchor="middle" font-size="9" fill="#888">Handles GET requests + 302</text>

    <!-- ANALYTICS SERVICE -->
    <rect x="590" y="220" width="170" height="70" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="675" y="245" text-anchor="middle" font-size="18">📊</text>
    <text x="675" y="264" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">Analytics Service</text>
    <text x="675" y="280" text-anchor="middle" font-size="9" fill="#888">Click tracking + flush</text>

    <!-- REDIS -->
    <rect x="270" y="360" width="200" height="70" rx="10" fill="#fff0f0" stroke="#dc2626" stroke-width="1.5"/>
    <text x="370" y="385" text-anchor="middle" font-size="18">⚡</text>
    <text x="370" y="404" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">Redis Cache</text>
    <text x="370" y="420" text-anchor="middle" font-size="9" fill="#888">In-memory · &lt;1ms reads</text>

    <!-- POSTGRES -->
    <rect x="100" y="460" width="200" height="70" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
    <text x="200" y="485" text-anchor="middle" font-size="18">🗄️</text>
    <text x="200" y="504" text-anchor="middle" font-size="11" fill="#1a1a1a" font-weight="600">PostgreSQL</text>
    <text x="200" y="520" text-anchor="middle" font-size="9" fill="#888">Persistent storage · source of truth</text>

    <line x1="150" y1="290" x2="170" y2="458" stroke="#ea580c" stroke-width="1.5" marker-end="url(#arrow-orange)"/>
    <text x="90" y="380" font-size="9" fill="#ea580c">INSERT url</text>

    <line x1="370" y1="290" x2="370" y2="358" stroke="#dc2626" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="376" y="330" font-size="9" fill="#dc2626">check cache</text>

    <line x1="290" y1="410" x2="230" y2="460" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrow)" stroke-dasharray="4,3"/>
    <text x="218" y="440" font-size="9" fill="#888">cache miss</text>

    <line x1="640" y1="290" x2="472" y2="378" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrow-blue)"/>
    <text x="570" y="330" font-size="9" fill="#2563eb">INCR counter</text>

    <path d="M 675 290 Q 680 440 310 500" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow)"/>
    <text x="620" y="420" font-size="9" fill="#888">flush every 5min</text>
  </svg>
</div>

---

## Features

- Secure short code generation using SHA-512 hashing and Base62 encoding
- Custom alias support with validation
- Duplicate prevention using unique database indexing
- Click tracking for each short URL
- RESTful API design
- URL validation and error handling
- Clean and modular project structure

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- Crypto (SHA-512)

### Frontend

- React
- Axios
- Chakra UI

---

## Project Structure

```
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── utils/
 └── components/
```

---

## API Endpoints

### Create Short URL

**POST** `/api/url/shorten`

Request Body:

```json
{
  "longUrl": "https://example.com",
  "urlCode": "customAlias"
}
```

Response:

```json
{
  "shortUrl": "http://localhost:5000/abc123",
  "urlCode": "abc123"
}
```

---

### Redirect to Original URL

**GET** `/:code`

Redirects the user to the original long URL and increments the click counter.

---

## Environment Variables

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
BASEURI=http://localhost:5000
```

---

## Installation

```
git clone <repository-url>
cd url-shortener
npm install
npm run dev
```

---

## Future Scope

- User authentication (JWT)
- Advanced analytics
- Expiry-based links
- Redis caching
- Rate limiting
- QR code generation
- Admin dashboard