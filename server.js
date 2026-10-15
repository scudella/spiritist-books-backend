import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import bookRouter from './routes/bookRouter.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import * as prometheusClient from 'prom-client';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as cloudy from 'cloudinary';
import rateLimiter from 'express-rate-limit';
import { apiReference } from '@scalar/express-api-reference';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const allowedOrigins = [
  'https://spiritist-books.scudella.net.br',
  'https://livros-espiritas.scudella.net.br',
  'https://spiritist-books-backend.scudella.net.br',
  'http://localhost:5000',
  'http://localhost:5173',
];

const register = new prometheusClient.Registry();
// Enable the collection of default Node.js process metrics
prometheusClient.collectDefaultMetrics({ register });

const httpRequestCounter = new prometheusClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path'],
  registers: [register],
});

// Middleware to track request count
app.use((req, res, next) => {
  res.on('finish', () => {
    const routePath = req.route
      ? `${req.baseUrl || ''}${req.route.path}`
      : req.path;
    httpRequestCounter.inc({ method: req.method, path: routePath });
  });
  next();
});

// Expose a /metrics endpoint for Prometheus
app.get('/metrics', async (_, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const openApiSpec = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'openapi.json'), 'utf-8'),
);

const faviconBuffer = fs.readFileSync(
  path.resolve(process.cwd(), 'public/favicon.ico'),
);
const faviconDataUri = `data:image/x-icon;base64,${faviconBuffer.toString('base64')}`;

// Serve Scalar UI
app.get(
  '/docs',
  apiReference({
    spec: { content: openApiSpec },
    theme: 'purple',
    telemetry: false,
    hideClientButton: true,
    title: 'API v1',
    slug: 'api-v1',
    showSidebar: false,
    hideModels: true,
    featuredClients: [],
    hiddenClients: true,
    setPageTitle: ({ _, document }) => `${document.title}`,
    showDeveloperTools: 'never',
    favicon: faviconDataUri,
  }),
);

const cloudinary = cloudy.v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.set('trust proxy', 1);

// Security & Parsing Middleware Chain
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", 'https://accounts.google.com/gsi/client'],
      defaultSrc: ["'self'", 'https://accounts.google.com'],
      styleSrc: [
        "'self'",
        'https://accounts.google.com/gsi/style',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/',
        "'unsafe-inline'",
      ],
      imgSrc: [
        "'self'",
        'https://lh3.googleusercontent.com',
        `${process.env.CLOUDINARY_IMAGES}`,
      ],
    },
  }),
);
app.use(
  helmet.crossOriginOpenerPolicy({
    policy: 'same-origin-allow-popups',
  }),
);
app.use(
  helmet.referrerPolicy({
    policy: 'strict-origin-when-cross-origin',
  }),
);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., Mobile Apps, Postman, Curl)
      if (!origin) return callback(null, true);

      // Allow allowed web domains
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject other web origins
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// when serving the front-end
// app.use(express.static(path.resolve(__dirname, './react-client/dist')));

// Parsers MUST precede mongoSanitize
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) {
    // Sanitize query keys without reassigning req.query itself
    for (const key in req.query) {
      if (key.startsWith('$') || key.includes('.')) {
        delete req.query[key];
      }
    }
  }
  next();
});

app.use('/api/v1/auth', apiLimiter, authRouter);
app.use('/api/v1/users', apiLimiter, userRouter);
app.use('/api/v1/books', apiLimiter, bookRouter);

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public/favicon.ico'));
});

// Send front-end files directly from client/dist
// disabled due to the /docs and the client being
// rendered by other means
// app.get('/*path', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './react-client/dist', 'index.html'));
// });

// Express 5 wildcard 404 handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
