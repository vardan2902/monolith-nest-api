export default () => ({
  node: {
    env: process.env.NODE_ENV || 'development',
  },
  base_url: process.env.BASE_URL || 'http://localhost',
  port: parseInt(process.env.PORT, 10) || 3000,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  rateLimit: {
    hourly: {
      expiresIn: 60 * 60,
      maxRequests: 10,
    },
    '5min': {
      expiresIn: 5 * 60,
    },
  },
  postgres: {
    '0_12': {
      host: process.env.POSTGRES_HOST_0_12,
      port: parseInt(process.env.POSTGRES_PORT_0_12, 10) || 5432,
      user: process.env.POSTGRES_USER_0_12,
      password: process.env.POSTGRES_PASSWORD_0_12,
      schema: process.env.POSTGRES_SCHEMA_0_12 || 'public',
      db: process.env.POSTGRES_DB_0_12,
      uri: process.env.POSTGRES_URI_0_12,
    },
    '12_24': {
      host: process.env.POSTGRES_HOST_12_24,
      port: parseInt(process.env.POSTGRES_PORT_12_24, 10) || 5433,
      user: process.env.POSTGRES_USER_12_24,
      password: process.env.POSTGRES_PASSWORD_12_24,
      schema: process.env.POSTGRES_SCHEMA_12_24 || 'public',
      db: process.env.POSTGRES_DB_12_24,
      uri: process.env.POSTGRES_URI_12_24,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    pubSubDB: parseInt(process.env.REDIS_PUB_SUB_DB, 10) || 0,
    rateLimitDB: parseInt(process.env.REDIS_RATE_LIMIT_DB, 10) || 1,
  },

  test: {
    mongo: {
      uri: 'mongodb://root:example@localhost:27018',
    },
    redis: {
      port: 6380,
      pubSubDB: 0,
      rateLimitDB: 1,
    },
    postgres: {
      '0_12': {
        host: 'postgres_0_12-test',
        port: 5434,
        user: 'test_user',
        password: 'test_password',
        schema: 'public',
        db: 'jobs_0_12',
        uri: 'postgres://test_user:test_password@localhost:5434/jobs_0_12',
      },
      '12_24': {
        host: 'postgres_12_24-test',
        port: 5435,
        user: 'test_user',
        password: 'test_password',
        schema: 'public',
        db: 'jobs_12_24',
        uri: 'postgres://test_user:test_password@localhost:5435/jobs_12_24',
      },
    },
  },
});
