import compression from 'compression';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { receiveTelegramWebhookUseCase } from './useCases';
import { EVENT_RECEIVED, SECRET_TOKEN_HEADER } from './utils/constants';
import logger from './utils/logger';
import validate, { receiveWebhookValidator } from './utils/validator';

const app = express();
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Test hook receive message
 * curl -H "Content-Type: application/json" \
   -X POST "localhost:5002/chat-telegram-webhook" -d \
   '{
      "update_id":201953040,
      "message":{
        "message_id":11,
        "from":{
          "id":1443174456,
          "is_bot":false,
          "first_name":"Binh",
          "last_name":"Nguyen Van",
          "language_code":"vi"
        },
        "chat":{
          "id":1443174456,
          "first_name":"Binh",
          "last_name":"Nguyen Van",
          "type":"private"
        },
        "date":1657175922,
        "text":"dsad"
      }
    }'
 */
app.post('/chat-telegram-webhook/:tenantId', receiveWebhookValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenantId } = req.params;
    const { body } = req;
    const secretToken = req.headers[SECRET_TOKEN_HEADER]?.toString() || '';

    // Checks this is an event from a page subscription
    logger.log(`[POST /chat-telegram-webhook/:tenantId] Received telegram webhook event [${tenantId}]: ${JSON.stringify(body, null, 2)}`);

    await receiveTelegramWebhookUseCase.invoke(body, tenantId, secretToken);
    // Returns a '200 OK' response to all requests
    res.status(200).send(EVENT_RECEIVED);
  } catch (e: any) {
    logger.log(`[POST /chat-telegram-webhook/:tenantId] Generated an error: ${e}`);
    res.json({ message: `${e.name}: ${e.message}` });
  }
});

export default app;
