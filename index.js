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
