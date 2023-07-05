import logger from './utils/logger';
import app from './app';

const port = process.env.PORT || 5005;
app.listen(port, () => {
  logger.log(`App listening at http://127.0.0.1:${port}`);
});
