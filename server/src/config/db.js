// db.js — drop-in replacement, no other files need to change
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

// Persists across warm serverless invocations
let cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

const connect = async () => {
  // Already connected — return instantly
  if (cached.conn) return cached.conn;

  // Connection in progress — wait for it, don't open another
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,       // share 10 connections across all requests
      minPoolSize: 2,        // keep 2 warm always
      bufferCommands: false, // fail fast instead of queuing forever
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;   // reset so next request can retry
    throw e;
  }

  return cached.conn;
};

module.exports = connect;
