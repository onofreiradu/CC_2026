
export const config = {
    db: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'my_api_db',
        password: process.env.DB_PASSWORD || '',
        port: Number.parseInt(process.env.DB_PORT || '5432'),
        database_url: process.env.DATABASE_URL || 'postgresql://postgres:@localhost:5432/my_api_db',
    },
    server: {
        port: Number.parseInt(process.env.PORT || '3010'),
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'dev_change_this_secret',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
        cookieName: process.env.AUTH_COOKIE_NAME || 'auth_token',
        cookieMaxAgeMs: Number.parseInt(process.env.AUTH_COOKIE_MAX_AGE_MS || '86400000'),
        cookieSameSite: (process.env.AUTH_COOKIE_SAME_SITE || 'lax') as 'lax' | 'none' | 'strict',
    },
    cors: {
        allowedOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173')
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean),
    },
};