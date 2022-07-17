import axios from 'axios';

export default class TelegramApiProvider {
  private readonly axiosInstance = axios.create({
    baseURL: 'https://api.telegram.org',
  });

  get = async (url: string, params?: Object) => {
    try {
      const query : any = { ...params };
      const response = await this.axiosInstance.get(url, { params: query });
      return response.data.result;
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      } else {
        throw e;
      }
    }
  };
}
