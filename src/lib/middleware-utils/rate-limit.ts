export type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
  message: string;
}

export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  '/api/contact': {
    maxRequests: 3,
    windowMs: 60_000, // 1 minute
    message: 'Too many requests. Please try again later.'
  },
  '/api/admin': {
    maxRequests: 3,
    windowMs: 60_000,
    message: 'Something went wrong. Please try again later.'
  },
  '/api/candidate': {
    maxRequests: 3,
    windowMs: 60_000,
    message: 'Something went wrong. Please try again later.'
  },
  '/api/auth': {
    maxRequests: 3,
    windowMs: 60_000,
    message: 'Something went wrong. Please try again later.'
  }
}

export const defaultRateLimit: RateLimitConfig = {
  maxRequests: 3,
  windowMs: 60_000,
  message: 'Something went wrong. Please try again later.'
}

// Rate limit tracking store
const ipToHits: Record<string, { count: number; resetAt: number; path: string }> = {}

export type RateLimitResult = {
  allowed: boolean;
  config: RateLimitConfig;
  remaining: number;
  reset: number;
  limit: number;
}

export function getRateLimit(ip: string, path: string): RateLimitResult {
  const now = Date.now()
  const config = Object.entries(rateLimitConfigs)
    .find(([prefix]) => path.startsWith(prefix))?.[1] || defaultRateLimit
  
  const key = `${ip}:${path}`
  const rec = ipToHits[key]

  if (!rec || now > rec.resetAt) {
    const resetAt = now + config.windowMs
    ipToHits[key] = { count: 1, resetAt, path }
    return { 
      allowed: true, 
      config,
      remaining: config.maxRequests - 1,
      reset: resetAt,
      limit: config.maxRequests
    }
  }

  if (rec.count < config.maxRequests) {
    rec.count += 1
    return { 
      allowed: true, 
      config,
      remaining: config.maxRequests - rec.count,
      reset: rec.resetAt,
      limit: config.maxRequests
    }
  }

  return { 
    allowed: false, 
    config,
    remaining: 0,
    reset: rec.resetAt,
    limit: config.maxRequests
  }
}

export function getRateLimitHeaders(result: RateLimitResult): Headers {
  return new Headers({
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString()
  })
}
