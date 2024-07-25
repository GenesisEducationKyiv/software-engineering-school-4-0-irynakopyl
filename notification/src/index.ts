import { app, initApp } from './app';
import metricsRegister from './common/metrics/registry';
import logger from './common/services/logger.service';

const port = process.env.PORT || 3000;

initApp().catch((error) => {
  logger.error(error);
});

app.get('/metrics', async (req, res, next) => {
  res.setHeader('Content-type', metricsRegister.contentType);
  res.send(await metricsRegister.metrics());
  next();
});

app.listen(port, async () => {
  logger.info(`Running on port ${port}`);
});
