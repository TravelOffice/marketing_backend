import cors from 'cors';
import express, { Request, Response } from 'express';
import { getEnv } from 'get-env';
import compression from 'compression';
import logger from './utils/logger';

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response) => {
  const env = await getEnv('NODE_ENV');
  logger.log(env);
  res.json({ message: 'hello' });
});

export default app;
