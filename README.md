# URL Shortener Project Documentation

## Project Overview

A production-ready URL Shortener application built with modern backend architecture and optimized performance. The system allows users to shorten URLs, create custom aliases, generate QR codes, and track analytics with a clean and modern user interface.

---

## 🏗 System Architecture (v1.0)

![URL Shortener Architecture](client/src/docs/architecture_img.png)

---

# Core Features Implemented

## 1. URL Shortening

* Users can submit a long URL.
* System validates the URL before processing.
* A unique short code is generated using Base62 encoding (b64 concept).
* The short URL is constructed using the base domain + generated code.
* Data stored in database includes:

  * urlCode
  * longUrl
  * shortUrl
  * clicks
  * createdAt
  * createdByIP

---

## 3. Custom Alias Support

* Users can provide a custom alias.
* Alias is validated using regex (letters, numbers, '-' and '_').
* System checks for uniqueness before saving.
* If alias already exists, request is rejected with HTTP 409.
* Allows personalized short links.

Example:

* Default: short.ly/abc123
* Custom: short.ly/vinay-portfolio

---

## 4. Rate Limiting (Sliding Window Algorithm using Redis)

* Implemented IP-based rate limiting.
* Allows maximum 10 requests per 60 seconds per IP.
* Built using Redis Sorted Sets.

### Redis Commands Used:

* ZREMRANGEBYSCORE → Removes timestamps older than 60 seconds.
* ZCARD → Counts active requests within the window.
* ZADD → Adds the current request timestamp.
* EXPIRE → Automatically cleans up inactive keys.

### How It Works:

1. Remove outdated requests using ZREMRANGEBYSCORE.
2. Count remaining requests using ZCARD.
3. If count >= 10 → return HTTP 429 (Too Many Requests).
4. If allowed → store current timestamp using ZADD.
5. Set TTL using EXPIRE to avoid memory leaks.

This prevents burst attacks and ensures accurate rolling window rate limiting.

---

## 5. Redis Integration

Redis is used for:

* Sliding window rate limiting.
* Fast in-memory operations.
* Distributed system scalability.
* Auto-expiry of rate limit keys.

Benefits:

* High performance
* Atomic operations
* Centralized rate control across multiple servers

---

## 6. QR Code Generation

* After generating the short URL, a QR code is automatically created.
* QR code is generated in Base64 format.
* Users can:

  * Download QR code
  * Scan QR code
  * Share QR visually

This improves usability for mobile sharing and offline usage.

---

## 7. URL Analytics

* Tracks total clicks per URL.
* Stores click count in database.
* Provides analytics dashboard per user.

Analytics include:

* Total clicks
* Individual URL performance
* User-specific URL statistics

This adds product-level value to the application.

---

## 8. Modern UI

* Clean and responsive interface.
* User-friendly dashboard.
* Easy copy-to-clipboard functionality.
* QR preview display.
* Smooth UX design principles.

Focus on professional and production-ready frontend experience.

---

# Technical Stack

Backend:

* Node.js
* Express.js
* MongoDB
* Redis

Frontend:

* Modern responsive UI

Additional Tools:

* QRCode generation library
* Base62 encoding (b64 concept)

---

# Security & Optimization

* Input validation for URLs
* Alias validation and uniqueness checks
* IP-based sliding window rate limiting using ZREMRANGEBYSCORE
* Proper HTTP status codes (400, 409, 429, 500)
* Fail-open strategy if Redis fails
* Trust proxy configuration for accurate IP detection

---

# System Design Concepts Applied

* Unique ID generation
* Base62 encoding for short codes
* Distributed rate limiting
* Sliding window algorithm
* In-memory caching using Redis
* Database indexing for fast lookup
* Production-level API handling

---

# How to Run the Project

## 1. Clone the Repository

```
git clone <your-repo-url>
cd <project-folder>
```

---

## 2. Backend Setup (Server)

```
cd server
npm install
```

Create a `.env` file using the provided `.env.example` file:

```
cp .env.example .env
```

Update the environment variables inside `.env`:

* PORT=
* MONGO_URI=
* REDIS_URL=
* BASEURI=
* JWT_SECRET=

Start the backend server:

```
npm start
```

---

## 3. Frontend Setup (Client)

Open a new terminal:

```
cd client
npm install
npm start
```

The frontend will start on the configured port (usually [http://localhost:3000](http://localhost:3000)).

---

## 4. Redis Setup

Make sure Redis is running locally or provide a Redis cloud URL inside `.env`.

Example (local Redis):

```
redis-server
```

---

# Summary

This URL Shortener project demonstrates:

* Backend engineering skills
* Distributed systems concepts
* Accurate sliding window rate limiting using ZREMRANGEBYSCORE
* Performance optimization using Redis
* Security best practices
* Real-world product features like analytics and QR generation
* Clean modern frontend implementation

The project is production-ready and designed with scalability, security, and performance in mind.
