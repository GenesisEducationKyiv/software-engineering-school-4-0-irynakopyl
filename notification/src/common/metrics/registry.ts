import client from 'prom-client';

const metricsRegister = new client.Registry();

client.collectDefaultMetrics({
  register: metricsRegister,
  prefix: 'notification_',
});

export default metricsRegister;
