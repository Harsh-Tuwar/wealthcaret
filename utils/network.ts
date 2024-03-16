import * as Crypto from 'expo-crypto';

import { log } from './logger';

abstract class network {
	private static BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

	private static getHeaders() {
		const headers = new Headers();
		headers.set('x-wealthcaret-timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
		headers.set('x-wealthcaret-version', '1.0.0');

		return headers;
	}

	static get = async (url: string) => {
		return new Promise(async (resolve, reject) => {
			log.debug(`Making a GET request to '${this.BASE_URL}${url}' path`);
			
			try {
				const request = await fetch(`${this.BASE_URL}${url}`, {
					headers: this.getHeaders()
				});

				const response = await request.json();
				log.info(`Sucessfull - GET ${url}`);

				if (response.error) {
					reject(response);
				} else {
					resolve(response.data);
				}
			} catch (error) {
				log.error(`Failed - GET ${url}: ${error}`);
				reject(error);
			}
		});
	}
}

export default network;
