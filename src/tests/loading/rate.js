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

export default function () {
  const res = http.get('http://localhost:3000/rate');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
