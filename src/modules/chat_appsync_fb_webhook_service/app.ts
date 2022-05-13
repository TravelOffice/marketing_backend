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

/**
 * Test hook receive message
 * curl -H "Content-Type: application/json" -X POST "localhost:5002/chat-fb-webhook" -d '{"object": "page", "entry": [{"messaging": [{"id":"1234","message": {"text": "abcdef"}, "sender": {"id": "1"}, "recipient": {"id": "2"}, "timestamp": "1234"}]}]}'
 */
app.post('/chat-fb-webhook', async (req: Request, res: Response) => {
  try {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      const promises = body.entry.map(async (entry: any) => {
        // Gets the message. entry.messaging is an array, but
        // will only ever contain one message, so we get index 0
        let webhookEvent = entry.messaging[0];
        console.info('[app.post] Received webhook event', webhookEvent);

        await appSyncRepository.sendReceivedMessageCommand(webhookEvent);
      });

      // Handle batch items
      await Promise.all(promises);

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  } catch (e: any) {
    console.log(`[App.ChatFbWebhook POST] Generated an error`, e);
    res.json({ message: `${e.name}: ${e.message}` });
  }
});

/**
 * Test hook
 * curl -X GET "localhost:5002/chat-fb-webhook?hub.verify_token=TOKEN_1234567890&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
 */
app.get('/chat-fb-webhook', async (req: Request, res: Response) => {
  try {
    // Your verify token. Should be a random string.
    const verifyToken = await getAwsSecretValue('FB_MESSAGE_PLATFORM_VERIFY_TOKEN');

    // Parse the query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === verifyToken) {

        // Responds with the challenge token from the request
        console.log('[app.get] WEBHOOK_VERIFIED');
        res.status(200).send(challenge);

      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  } catch (e: any) {
    console.log(`[App.ChatFbWebhook GET] Generated an error`, e);
    res.json({ message: `${e.name}: ${e.message}` });
  }
});

export default app;
