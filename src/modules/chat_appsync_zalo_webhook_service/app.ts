import cors from 'cors';
import express, { Request, Response } from 'express';
import compression from 'compression';
import { getAwsSecretValue } from 'get-env';
import { appSyncRepository } from './repositories';

const app = express();
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSendDataEvents = [
  'user_send_text',
  'user_send_image',
  'user_send_link',
  'user_send_audio',
  'user_send_video',
  'user_send_sticker',
  'user_send_location',
  'user_send_business_card',
  'user_send_file'
]

/**
 * Test hook receive message
 * curl -H "Content-Type: application/json" -X POST "localhost:5002/chat-zalo-webhook" -d '
{"app_id": "1364765243717231492","sender": {"id": "246845883529197922"}, "user_id_by_app": "552177279717587730", "recipient": { "id": "388613280878808645"}, "event_name": "user_send_text","message": {"text": "User sent message successfully", "msg_id": "96d3cdf3af150460909"}, "timestamp": "154390853474"}'
 */
app.post('/chat-zalo-webhook', async (req: Request, res: Response) => {
  try {
    const zaloAppId = await getAwsSecretValue('ZALO_MESSAGE_PLATFORM_APP_ID');
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.app_id === zaloAppId) {
      console.info('[app.post] Received webhook event', body);
      // Check this is user sent message event
      if (userSendDataEvents.includes(body.event_name)) {
        await appSyncRepository.sendReceivedMessageCommand(body);
      }

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  } catch (e: any) {
    console.log(`[App.ChatZaloWebhook POST] Generated an error`, e);
    res.json({ message: `${e.name}: ${e.message}` });
  }
});

export default app;
