import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_duration: ['p(99) < 3000'],
  },
  stages: [
    { duration: '30s', target: 15 },
    { duration: '1m', target: 15 },
    { duration: '20s', target: 0 },
  ],
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default function () {
  const res = http.post('http://localhost:3000/subscribe', { email: `test-user${getRandomInt(100000000)}@test.domain.com` });
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
