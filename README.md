# URL Shortener

A secure and scalable URL Shortener application built using Node.js, Express, MongoDB, and React. This project supports both auto-generated short links and custom personalized URLs with proper validation and collision prevention.

---

## Features

* Secure short code generation using SHA-512 hashing and Base62 encoding
* Custom alias support with validation
* Duplicate prevention using unique database indexing
* Click tracking for each short URL
* RESTful API design
* URL validation and error handling
* Clean and modular project structure

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* Crypto (SHA-512)

### Frontend

* React
* Axios
* Chakra UI

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

```
{
  "longUrl": "https://example.com",
  "urlCode": "customAlias"  // optional
}
```

Response:

```
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

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
BASEURI=http://localhost:5000
```

---

## Installation

1. Clone the repository

```
git clone <repository-url>
cd url-shortener
```

2. Install dependencies

```
npm install
```

3. Run the server

```
npm run dev
```

---

## Current Scope

* Secure short URL generation
* Custom URL support
* Click tracking
* URL validation
* Database-level uniqueness enforcement
* Modular backend architecture

---

## Future Scope

* User authentication (JWT)
* Advanced analytics (device, location, referrer tracking)
* Expiry-based links
* Redis caching for performance optimization
* Rate limiting and abuse protection
* QR code generation
* Admin dashboard

---

This project is built with scalability and extensibility in mind, allowing future integration of advanced system design components such as caching layers, analytics pipelines, and distributed deployment strategies.
