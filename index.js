import serverlessExpress from '@codegenie/serverless-express';
import app from './server.js';
import { connectDB } from './db/connect.js';

let serverlessExpressHandler;

async function setup(event, context) {
  await connectDB(process.env.MONGO_URL);
  serverlessExpressHandler = serverlessExpress({ app });
  return await serverlessExpressHandler(event, context);
}

export const handler = async (event, context) => {
  if (serverlessExpressHandler) {
    return await serverlessExpressHandler(event, context);
  }
  return await setup(event, context);
};
