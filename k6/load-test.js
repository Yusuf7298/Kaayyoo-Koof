import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Rate, Trend, Counter, Gauge } from 'k6/metrics'

// Custom metrics
export const errorRate = new Rate('errors')
export const duration = new Trend('request_duration')
export const successCounter = new Counter('successful_requests')
export const activeUsers = new Gauge('active_users')

// Test configuration for different scenarios
export const scenarios = {
  // Normal load test: 100 users over 5 minutes
  normal_load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '30s', target: 10 },
      { duration: '2m', target: 100 },
      { duration: '1m', target: 50 },
      { duration: '30s', target: 0 },
    ],
  },

  // Spike test: Sudden 500 users
  spike_load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '30s', target: 10 },
      { duration: '10s', target: 500 },
      { duration: '2m', target: 500 },
      { duration: '30s', target: 0 },
    ],
  },

  // Event registration surge: Typical during event registration opening
  event_registration_surge: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 50 },
      { duration: '5s', target: 1000 }, // Sudden spike
      { duration: '3m', target: 800 },
      { duration: '1m', target: 100 },
      { duration: '30s', target: 0 },
    ],
  },

  // Endurance test: Constant load for 24 hours
  endurance: {
    executor: 'constant-vus',
    vus: 100,
    duration: '24h',
  },

  // Stress test: Gradually increase until system breaks
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 100 },
      { duration: '2m', target: 200 },
      { duration: '2m', target: 300 },
      { duration: '2m', target: 400 },
      { duration: '2m', target: 500 },
      { duration: '5m', target: 500 },
      { duration: '2m', target: 0 },
    ],
  },
}

// Test thresholds
export const options = {
  scenarios: {
    normal_load: scenarios.normal_load,
  },
  thresholds: {
    'request_duration': ['p(99)<1000'], // 99th percentile must be below 1 second
    'errors': ['rate<0.1'], // Error rate must be below 10%
    'http_req_status{staticAsset:yes}': ['p(99)<300'], // Static assets must load quickly
  },
  vus: 10,
  duration: '5m',
}

const BASE_URL = __ENV.TEST_URL || 'http://localhost:3000'

// Authentication token (obtain from login before tests)
let authToken = ''

// Setup: Run once before tests
export function setup() {
  console.log('Setting up test environment...')

  // Login to get auth token
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, {
    email: 'test@example.com',
    password: 'testpassword123',
  })

  if (loginRes.status === 200) {
    authToken = loginRes.json('token')
    console.log('✓ Authentication successful')
  } else {
    console.error('✗ Authentication failed')
  }

  return { authToken }
}

export default function (data) {
  // Update active users metric
  activeUsers.add(__ENV.USERS || 1)

  group('Homepage', () => {
    const res = http.get(`${BASE_URL}/`)
    check(res, {
      'status is 200': (r) => r.status === 200,
      'load time < 500ms': (r) => r.timings.duration < 500,
    })
    duration.add(res.timings.duration)
  })

  sleep(1)

  group('Announcements API', () => {
    const res = http.get(`${BASE_URL}/api/announcements`)
    check(res, {
      'status is 200': (r) => r.status === 200,
      'has data': (r) => r.json().length > 0,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
    })
    errorRate.add(res.status !== 200)
    duration.add(res.timings.duration)
    if (res.status === 200) successCounter.add(1)
  })

  sleep(1)

  group('Events Listing', () => {
    const res = http.get(`${BASE_URL}/api/events`)
    check(res, {
      'status is 200': (r) => r.status === 200,
      'has events': (r) => r.json().length > 0,
    })
    duration.add(res.timings.duration)
  })

  sleep(1)

  group('Camps API', () => {
    const res = http.get(`${BASE_URL}/api/camps`)
    check(res, {
      'status is 200': (r) => r.status === 200,
      'performance acceptable': (r) => r.timings.duration < 1500,
    })
    errorRate.add(res.status !== 200)
    duration.add(res.timings.duration)
  })

  sleep(1)

  group('Statistics API', () => {
    const res = http.get(`${BASE_URL}/api/stats`)
    check(res, {
      'status is 200': (r) => r.status === 200,
      'stats available': (r) => r.json('health') !== undefined,
    })
    duration.add(res.timings.duration)
  })

  sleep(1)

  // Event Registration (requires authentication)
  group('Event Registration', () => {
    const eventRes = http.post(
      `${BASE_URL}/api/events/1/register`,
      {},
      {
        headers: {
          Authorization: `Bearer ${data.authToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    check(eventRes, {
      'registration successful': (r) => r.status === 201 || r.status === 200,
      'registration response time acceptable': (r) => r.timings.duration < 2000,
    })

    if (eventRes.status !== 201 && eventRes.status !== 200) {
      errorRate.add(1)
    } else {
      successCounter.add(1)
    }

    duration.add(eventRes.timings.duration)
  })

  sleep(1)

  // Bot Analytics Query
  group('Bot Analytics', () => {
    const res = http.get(`${BASE_URL}/api/analytics/bot`)
    check(res, {
      'status is 200': (r) => r.status === 200,
      'analytics data present': (r) => r.json('command_summary') !== undefined,
    })
    duration.add(res.timings.duration)
  })

  sleep(1)

  // Concurrent API calls to test connection pool
  group('Concurrent Operations', () => {
    const requests = [
      {
        method: 'GET',
        url: `${BASE_URL}/api/announcements`,
        params: { tags: ['test'] },
      },
      {
        method: 'GET',
        url: `${BASE_URL}/api/camps`,
        params: { category: 'leadership' },
      },
      {
        method: 'GET',
        url: `${BASE_URL}/api/events`,
        params: { status: 'upcoming' },
      },
      {
        method: 'GET',
        url: `${BASE_URL}/api/stats`,
      },
    ]

    const responses = http.batch(requests)

    responses.forEach((res) => {
      check(res, {
        'status is 2xx': (r) => r.status >= 200 && r.status < 300,
      })
      duration.add(res.timings.duration)
    })
  })

  sleep(2)
}

// Teardown: Run once after tests
export function teardown(data) {
  console.log('Tearing down test environment...')

  // Generate summary
  const summary = {
    total_duration: `${__ENV.TEST_DURATION || '5m'}`,
    average_response_time: `${Math.round(duration.value)}ms`,
    error_rate: `${(errorRate.value * 100).toFixed(2)}%`,
    successful_requests: successCounter.value,
  }

  console.log('Test Summary:', JSON.stringify(summary, null, 2))
}

// Helper function for different test profiles
export function testProfile(profile) {
  options.scenarios.main = scenarios[profile]
  return options
}
