import { app, initApp } from './app';
import logger from './service/services/logger.service';

const port = process.env.PORT || 3000;

initApp().catch((error) => {
  logger.info(error);
});

app.listen(port, async () => {
  logger.info(`Running on port ${port}`);
});
