import * as firebase from 'firebase-admin';
import { messaging } from 'firebase-admin';
import { getAwsSecretValue, getEnv } from 'get-env';
import * as fs from 'fs';
import MessagingPayload = messaging.MessagingPayload;

export default class FcmProvider {
  private app: firebase.app.App | undefined;

  public async subscribeToTopic(registrationTokens: string[], topic: string): Promise<void> {
    if (!this.app) {
      await this.init();
    }
    const result = await messaging().subscribeToTopic(registrationTokens, `/topics/${topic}`);
    if (result.errors.length > 0) {
      throw new Error(result.errors[0].error.message);
    }
  }

  public async unsubscribeTopic(registrationTokens: string[], topic: string): Promise<void> {
    if (!this.app) {
      await this.init();
    }
    const result = await messaging().unsubscribeFromTopic(registrationTokens, topic);
    if (result.errors.length > 0) {
      throw new Error(result.errors[0].error.message);
    }
  }

  public async sendMessageToTopic(
    topic: string,
    payload: MessagingPayload,
  ): Promise<void> {
    if (!this.app) {
      await this.init();
    }
    await messaging().sendToTopic(`/topics/${topic}`, payload);
  }

  private async init() {
    // Read firebase credential from infrastructure constant Secret manager
    const secretId = getEnv('INFRASTRUCTURE_SECRET_MANAGER_ID');
    const firebaseCredential = await getAwsSecretValue('FIREBASE_CREDENTIAL', secretId);
    const filePath = '/tmp/firebase_admin_sdk.json';
    process.env.GOOGLE_APPLICATION_CREDENTIALS = filePath;
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, firebaseCredential);
      this.app = firebase.initializeApp({
        credential: firebase.credential.cert(filePath),
      });
    }
  }
}
