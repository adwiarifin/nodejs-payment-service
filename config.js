require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    token: {
        access: {
            secret: process.env.ACCESS_SECRET || '',
            ttl: Number(process.env.ACCESS_TTL || '1800'),
        },
        refresh: {
            secret: process.env.REFRESH_SECRET || '',
            ttl: Number(process.env.REFRESH_TTL || '86400'),
        }
    },
    mongo: {
        database_url: process.env.MONGO_DATABASE_URL || '',
    },
    redis: {
        host: process.env.REDIS_HOST || '',
        port: process.env.REDIS_PORT || '',
        auth: process.env.REDIS_AUTH || '',
        db: process.env.REDIS_QUEUE_DB || 0,
    }
}