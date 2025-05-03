import Redis from 'ioredis';

import { logger } from 'src/utils/logger';

abstract class WealthcaretRedis {
	private static redisConn: Redis;

	private static buildRedisUri() {
		if (
			!process.env.REDIS_USERNAME ||
			!process.env.REDIS_PASSWORD ||
			!process.env.REDIS_HOST ||
			!process.env.REDIS_PORT
		) {
			throw new Error('Missing required env variables for Redis!');
		}
	
		const { 
			REDIS_USERNAME,
			REDIS_PASSWORD,
			REDIS_HOST,
			REDIS_PORT,
			REDIS_DB
		} = process.env;

		const redisUri = `rediss://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`;

		return redisUri;
	}

	private static getRedisConn() {
		if (!this.redisConn) {
			const redisUri = this.buildRedisUri();
			this.redisConn = new Redis(redisUri);
			this.redisConn.connect((error) => {
				logger.error(error);
			});
		}

		return this.redisConn;
	}

	static async setValue(key: string, value: any, expiry?: string | number) {
		const redis = this.getRedisConn();

		try {
			logger.info({
				message: 'Setting Redis Key',
				key,
				value
			});

			await redis.set(key, value);

			if (expiry) {
				await redis.expireat(key, expiry);
				logger.info({
					message: 'Setting expiry of key',
					key,
					expiry,
				});
			}
		} catch (err) {
			logger.error({
				message: 'Error setting Redis Key',
				key,
				value,
				error: err
			});
		}
	}

	static async getValue(key: string) {
		const redis = this.getRedisConn();

		try {
			const value = await redis.get(key);

			return value;
		} catch (error) {
			logger.error({
				message: 'Error getting Redis Key',
				key,
				error: error
			});
			throw new Error(error);
		}
	}

	static async disconnect() {
		const redis = this.getRedisConn();

		redis.disconnect();
	}
}

export default WealthcaretRedis;
