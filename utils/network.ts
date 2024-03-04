import { log } from './logger';

abstract class network {
	private static BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

	static get = async (url: string) => {
		return new Promise(async (resolve, reject) => {
			log.debug(`Making a GET request to '${url}' path`);
			const request = await fetch(`${this.BASE_URL}${url}`);
			
			try {
				const response = await request.json();
				log.info(`Sucessfull - GET ${url}`);

				if (response.error) {
					reject(response);
				} else {
					resolve(response.data);
				}
			} catch (error) {
				log.error(`Failed - GET ${url}`);
				reject(error);
			}
		});
	}
}

export default network;
