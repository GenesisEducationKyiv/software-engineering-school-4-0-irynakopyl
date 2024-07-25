import client from 'prom-client';

const metricsRegister = new client.Registry();

client.collectDefaultMetrics({
  register: metricsRegister,
  prefix: 'server_',
});

export default metricsRegister;
