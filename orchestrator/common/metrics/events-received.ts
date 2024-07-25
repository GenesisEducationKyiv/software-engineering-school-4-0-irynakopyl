import client from 'prom-client';
import metricsRegister from './registry';

const events_received_total = new client.Counter({
  name: 'orchestrator_events_received_total',
  help: 'The total number of event received from message broker',
  labelNames: ['topic', 'event'],
});

metricsRegister.registerMetric(events_received_total);

export default events_received_total;
