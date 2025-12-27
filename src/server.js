import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import securityMiddleware from './middleware/security.middleware.js';

import { ENV } from './config/env.js';

const app = express();
app.use(helmet()); // security middleware, protects against common web vulnerabilities like XSS, etc.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(securityMiddleware); // arcjet middleware

// morgan：get http request info
// morgan captures request info and passes it to logger
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

app.get('/', (req, res) => res.send('Hello from server'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  logger.error('Unhandled error', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    request: {
      method: req.method,
      url: req.url,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.body,
      query: req.query,
      params: req.params,
    },
    timestamp: new Date().toISOString(),
  });
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const startServer = async () => {
  try {
    // await connectDB();

    // listen for local development
    if (ENV.NODE_ENV !== 'production') {
      app.listen(ENV.PORT, () =>
        console.log('Server is up and running on PORT:', ENV.PORT)
      );
    }
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
