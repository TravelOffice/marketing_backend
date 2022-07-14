import app from './app';
import logger from './utils/logger';

const port = process.env.PORT || 5005;
app.listen(port, () => {
  logger.log(`App listening at http://127.0.0.1:${port}`);
});
