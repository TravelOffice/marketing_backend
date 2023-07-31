import { logger } from 'core';
import app from './estimationApp';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.log(`App listening at http://127.0.0.1:${port}`);
});
