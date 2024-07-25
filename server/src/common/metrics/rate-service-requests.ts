import client from 'prom-client';
import metricsRegister from './registry';

const rate_request_total = new client.Counter({
  name: 'server_rates_request_total',
  help: 'The total number of HTTP requests to get the currency rate',
  labelNames: ['service', 'response'],
});

metricsRegister.registerMetric(rate_request_total);

export default rate_request_total;
