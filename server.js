import * as dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import { connectDB } from './db/connect.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import bookRouter from './routes/bookRouter.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import * as prometheusClient from 'prom-client';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as cloudy from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

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
app.use((req, _, next) => {
  httpRequestCounter.inc({ method: req.method, path: req.path });
  next();
});

// Expose a /metrics endpoint for Prometheus
app.get('/metrics', async (_, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const cloudinary = cloudy.v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.set('trust proxy', 1);

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
  })
);
app.use(
  helmet.crossOriginOpenerPolicy({
    policy: 'same-origin-allow-popups',
  })
);
app.use(
  helmet.referrerPolicy({
    policy: 'strict-origin-when-cross-origin',
  })
);

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(mongoSanitize());

app.use(express.static(path.resolve(__dirname, './react-client/dist')));
app.use(
  '/user',
  express.static(path.resolve(__dirname, './react-client/dist'))
);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/books', bookRouter);

// Send front-end files directly from client/dist
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './react-client/dist', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
