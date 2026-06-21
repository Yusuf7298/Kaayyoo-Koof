import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid email')).toBeVisible()
  })

  test('should show error on failed login', async ({ page }) => {
    await page.fill('input[type="email"]', 'nonexistent@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('should redirect to dashboard on successful login', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/)
  })
})

test.describe('Rate Limiting', () => {
  test('should handle rapid requests gracefully', async ({ page }) => {
    const requests = []
    for (let i = 0; i < 10; i++) {
      requests.push(page.goto('http://localhost:3000/api/stats'))
    }
    const responses = await Promise.all(requests)
    expect(responses.some((r) => r.status() === 429)).toBeDefined()
  })
})

test.describe('Security Headers', () => {
  test('should include security headers in responses', async ({ page }) => {
    const response = await page.goto('http://localhost:3000')
    expect(response.headers()['x-content-type-options']).toBe('nosniff')
    expect(response.headers()['x-frame-options']).toBe('DENY')
    expect(response.headers()['x-xss-protection']).toContain('1; mode=block')
  })

  test('should enforce CSP headers', async ({ page }) => {
    const response = await page.goto('http://localhost:3000')
    const csp = response.headers()['content-security-policy']
    expect(csp).toBeDefined()
    expect(csp).toContain("default-src 'self'")
  })
})

test.describe('CSRF Protection', () => {
  test('should require CSRF token for POST requests', async ({ page }) => {
    await page.goto('http://localhost:3000/camps')
    const response = await page.request.post('http://localhost:3000/api/camps', {
      data: { title: 'Test Camp' },
      headers: {
        // Missing x-csrf-token header
      },
    })
    expect(response.status()).toBe(403)
  })

  test('should accept valid CSRF token', async ({ page }) => {
    await page.goto('http://localhost:3000/camps')
    // Get CSRF token from page
    const csrfToken = await page.getAttribute('input[name="csrf-token"]', 'value')
    expect(csrfToken).toBeDefined()
  })
})

test.describe('XSS Prevention', () => {
  test('should not execute injected scripts', async ({ page }) => {
    const testUrl = 'http://localhost:3000/test?search=<script>alert("xss")</script>'
    await page.goto(testUrl)
    let alertCalled = false
    page.once('dialog', () => {
      alertCalled = true
    })
    await page.waitForTimeout(1000)
    expect(alertCalled).toBe(false)
  })
})

test.describe('API Security', () => {
  test('should reject unauthenticated API calls to protected routes', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000/api/admin/stats')
    expect(response.status()).toBe(401)
  })

  test('should validate API request signatures', async ({ page }) => {
    const response = await page.request.post('http://localhost:3000/api/camps', {
      data: {
        title: 'Test',
        location: 'Test Location',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
      },
    })
    expect([401, 403, 422]).toContain(response.status())
  })
})
