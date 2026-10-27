// Only load dotenv in local development / PM2 environments
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  await import('dotenv/config');
}
import serverlessExpress from '@codegenie/serverless-express';
import app from './server.js';
import { connectDB } from './db/connect.js';

let serverlessExpressHandler;

async function setup(event, context) {
  if (!process.env.MONGO_URL) {
    throw new Error(
      'MONGO_URL environment variable is missing in Lambda execution environment.',
    );
  }
  await connectDB(process.env.MONGO_URL);
  serverlessExpressHandler = serverlessExpress({ app });
  return await serverlessExpressHandler(event, context);
}

// --- 1. AWS Lambda Handler ---
export const handler = async (event, context) => {
  if (serverlessExpressHandler) {
    return await serverlessExpressHandler(event, context);
  }
  try {
    return await setup(event, context);
  } catch (error) {
    console.error('Lambda Initialization Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Initialization Failed',
        message: error.message,
      }),
    };
  }
};

// --- 2. PM2 / Standalone Server Runner ---
// AWS Lambda automatically injects AWS_LAMBDA_FUNCTION_NAME.
// If this variable is absent, we are running under PM2 on node1.
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '0.0.0.0';

  if (!process.env.MONGO_URL) {
    console.error('FATAL: MONGO_URL environment variable is missing.');
    process.exit(1);
  }

  let server;

  const gracefulShutdown = (signal) => {
    console.log(`${signal} received. Closing HTTP server...`);
    if (server) {
      server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
      });
    } else {
      console.log('Server was not running yet. Exiting process.');
      process.exit(0);
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  connectDB(process.env.MONGO_URL)
    .then(() => {
      server = app.listen(PORT, HOST, () => {
        console.log(`Server listening on http://${HOST}:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1);
    });
}
