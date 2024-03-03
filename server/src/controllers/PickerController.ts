import { Request, Response } from 'express';
import yahooFinance from 'yahoo-finance2';
import { logger } from '../utils/logger';

export const GetPickerData_ByQuery = async (req: Request, res: Response) => {
	try {
		const { query: searchQuery } = req.query;

		logger.info(`Received a search query: ${searchQuery}`);

		if (!searchQuery) {
			logger.info(`No search query provided, returning none!`);

			return res.json({
				data: [],
				error: false
			});
		}

		const response = await yahooFinance.search(searchQuery as string);

		logger.info(`found ${response.count} results! Returning to the client!`);

		return res.json({
			error: false,
			data: response
		});
	} catch (error) {
		logger.error(error);
		return res.json({
			data: [],
			error: true
		});
	}
};
