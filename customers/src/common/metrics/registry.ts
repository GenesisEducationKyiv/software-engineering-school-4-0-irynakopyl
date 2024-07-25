import client from 'prom-client';

const metricsRegister = new client.Registry();

client.collectDefaultMetrics({
  register: metricsRegister,
  prefix: 'customers_',
});

export default metricsRegister;
