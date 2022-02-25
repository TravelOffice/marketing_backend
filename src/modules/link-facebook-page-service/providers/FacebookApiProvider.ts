import axios from 'axios';

export default class FacebookApiProvider {
  private readonly axiosInstance = axios.create({
    baseURL: 'https://graph.facebook.com/v13.0/',
  });

  get = async (url: string, token?: string, params?: Object) => {
    try {
      let query : any = { ...params };
      if (token) {
        query = {
          ...params,
          access_token: token,
        };
      }
      const response = await this.axiosInstance.get(url, { params: query });
      return response.data;
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        throw new Error(e.message);
      } else {
        throw e;
      }
    }
  };
}
