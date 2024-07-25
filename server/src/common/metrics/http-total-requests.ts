import client from 'prom-client';
import metricsRegister from './registry';

const http_request_total = new client.Counter({
  name: 'server_http_request_total',
  help: 'The total number of HTTP requests received',
  labelNames: ['path', 'method'],
});

metricsRegister.registerMetric(http_request_total);

export default http_request_total;
