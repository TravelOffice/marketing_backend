import cors from 'cors';
import express, { Request, Response } from 'express';
import compression from 'compression';
import { getAwsSecretValue } from 'get-env';
import logger from './utils/logger';
import { sendDataEvents } from './utils/constants';
import { receiveWebhookUseCase } from './useCases';

const app = express();
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* eslint-disable max-len */
/**
 * Test hook receive message
 * curl -H "Content-Type: application/json" -X POST "localhost:5002/chat-zalo-webhook" -d '
{"app_id": "1364765243717231492","sender": {"id": "246845883529197922"}, "user_id_by_app": "552177279717587730", "recipient": { "id": "388613280878808645"}, "event_name": "user_send_text","message": {"text": "User sent message successfully", "msg_id": "96d3cdf3af150460909"}, "timestamp": "154390853474"}'
 */
/* eslint-enable max-len */
app.post('/chat-zalo-webhook', async (req: Request, res: Response) => {
  try {
    const zaloAppId = await getAwsSecretValue('ZALO_MESSAGE_PLATFORM_APP_ID');
    const { body } = req;

    // Checks this is an event from a page subscription
    if (body.app_id === zaloAppId) {
      logger.log(`[POST /chat-zalo-webhook] Received webhook event ${JSON.stringify(body)}`);
      // Check this is user sent message event
      if (sendDataEvents.includes(body.event_name)) {
        await receiveWebhookUseCase.invoke(body);
      } else {
        logger.log(`[POST /chat-zalo-webhook] Unsupported webhook event ${body.event_name}`);
      }

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  } catch (e: any) {
    logger.log(`[POST /chat-zalo-webhook] Generated an error ${e}`);
    res.json({ message: `${e.name}: ${e.message}` });
  }
});

export default app;
