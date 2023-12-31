require('dotenv').config();
const path = require('path');
const { readFileSync } = require('fs');

// protocols
const https = require('https');

const credentials = {
  pfx: readFileSync('/etc/scudella/scudella.pfx'),
  passphrase: readFileSync('/etc/scudella/passphrase'),
};

require('express-async-errors');
// express
const express = require('express');
const app = express();

// database
const connectDB = require('./db/connect');
const mongoSanitize = require('express-mongo-sanitize');

// other packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// routers

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const bookRouter = require('./routes/bookRouter');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

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

// go through all middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(mongoSanitize());

app.use(express.static('./public'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/books', bookRouter);

// Send front-end files directly from client/dist
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './-react-client/dist', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const httpsServer = https.createServer(credentials, app);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    httpsServer.listen(
      port,
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
