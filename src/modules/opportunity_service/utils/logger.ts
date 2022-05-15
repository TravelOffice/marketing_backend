const logger = {
  log(message: any) {
    const caller = new Error().stack?.split('\n')[1].trim().split(' ')[2];
    console.log(`[${caller}]: ${message}`);
  },
};

export default logger;
