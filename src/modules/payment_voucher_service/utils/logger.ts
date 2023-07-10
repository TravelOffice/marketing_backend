/* eslint-disable no-console */
const logger = {
  log(...args: any[]) {
    const caller = new Error().stack?.split('\n')[2].replace('at', '').trim();
    console.log(`[${caller}]:`, ...args);
  },
};

export default logger;
