import client from 'prom-client';
import metricsRegister from './registry';

const events_sent_total = new client.Counter({
  name: 'orchestrator_events_sent_total',
  help: 'The total number of event sent to message broker',
  labelNames: ['topic', 'event'],
});

metricsRegister.registerMetric(events_sent_total);

export default events_sent_total;
