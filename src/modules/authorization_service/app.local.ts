/* eslint-disable import/no-extraneous-dependencies */
import compression from 'compression';
import express, { Request, Response } from 'express';
import { handler } from './lambda';
import logger from './utils/logger';

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5002;
app.listen(port, () => {
  logger.log(`App listening at http://127.0.0.1:${port}`);
});

app.post('/', async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const callback = (message: string, value: any) => {
      logger.log(`Callback[${message}]: ${JSON.stringify(value)}`);
    };
    const data = await handler(body.event, body.context, callback);
    res.status(200).send({ message: 'SUCCESS', data });
  } catch (e: any) {
    logger.log(`Error: ${e}`);
    res.json({ message: `${e.name}: ${e.message}` });
  }
});
