const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { getAllowedOrigins } = require('./config/corsOrigins');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`${name} is not set.`);
  }
}

requireEnv('JWT_SECRET');
requireEnv('MONGO_URI');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = getAllowedOrigins();

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      return callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mixencryption-api' });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);

let server;

function shutdown() {
  if (!server) {
    process.exit(0);
    return;
  }
  server.close(() => {
    mongoose.connection.close(false).finally(() => process.exit(0));
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.once('SIGUSR2', () => {
  if (!server) {
    process.kill(process.pid, 'SIGUSR2');
    return;
  }
  server.close(() => {
    mongoose.connection.close(false).finally(() => process.kill(process.pid, 'SIGUSR2'));
  });
});

connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`MixEncryption API listening on http://localhost:${PORT}`);
      console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `Port ${PORT} is already in use. Close the other terminal or run: Get-NetTCPConnection -LocalPort ${PORT} | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`,
        );
        process.exit(1);
      }
      throw err;
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
