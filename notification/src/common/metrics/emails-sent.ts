import client from 'prom-client';
import metricsRegister from './registry';

const emails_sent_total = new client.Counter({
  name: 'notification_emails_sent_total',
  help: 'The total number of emails sent',
  labelNames: ['email'],
});

metricsRegister.registerMetric(emails_sent_total);

export default emails_sent_total;
