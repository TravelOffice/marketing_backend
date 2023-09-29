import * as firebase from 'firebase-admin';
import { messaging } from 'firebase-admin';
import { getAwsSecretValue } from 'get-env';
import * as fs from 'fs';
import MessagingPayload = messaging.MessagingPayload;

export default class FcmProvider {
  private app: firebase.app.App | undefined;

  public async subscribeToTopic(registrationTokens: string[], topic: string): Promise<void> {
    if (!this.app) {
      await this.init();
    }
    await messaging().subscribeToTopic(registrationTokens, `/topics/${topic}`);
  }

  public async unsubscribeTopic(registrationTokens: string[], topic: string): Promise<void> {
    if (!this.app) {
      await this.init();
    }
    await messaging().unsubscribeFromTopic(registrationTokens, topic);
  }

  public async sendMessageToTopic(topic: string, payload: MessagingPayload): Promise<void> {
    if (!this.app) {
      await this.init();
    }
    await messaging().sendToTopic(`/topics/${topic}`, payload);
  }

  private async init() {
    const firebaseCredential = await getAwsSecretValue('FIREBASE_CREDENTIAL');
    const filePath = '/tmp/firebase_admin_sdk.json';
    process.env.GOOGLE_APPLICATION_CREDENTIALS = filePath;
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, firebaseCredential);
    }
    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(filePath),
    });
  }
}
