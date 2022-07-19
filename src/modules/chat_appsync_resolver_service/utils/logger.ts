const logger = {
  log(message: any, ...optionalParams: any[]) {
    const caller = new Error().stack?.split('\n')[1].trim().split(' ')[2];
    // eslint-disable-next-line no-console
    console.log(`[${caller}]: ${message}`, ...optionalParams);
  },
};

export default logger;
