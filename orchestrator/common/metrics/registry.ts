import client from 'prom-client';

const metricsRegister = new client.Registry();

client.collectDefaultMetrics({
  register: metricsRegister,
  prefix: 'orchestrator_',
});

export default metricsRegister;
