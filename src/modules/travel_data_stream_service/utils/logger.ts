/* eslint-disable no-console */
const logger = {
  log(message: any) {
    const caller = new Error().stack?.split('\n')[1].trim().split(' ')[2];
    console.log(`[${caller}]: ${message}`);
  },
  table(message: string, data: any) {
    console.log(message);
    console.table(data);
  },
};

export default logger;
