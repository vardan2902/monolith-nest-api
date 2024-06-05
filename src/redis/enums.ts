export enum RedisNamespaces {
  SUBSCRIBER = 'SUB:',
  PUBLISHER = 'PUB:',
  RATE_LIMIT = 'RATE_LIMIT:',
}

export enum RateLimitingInterval {
  HOURLY = 'HOURLY',
  '5_MIN' = '5_MIN',
}
