import { Request, Response } from 'express';
import yahooFinance from 'yahoo-finance2';
import { logger } from '../utils/logger';

export const SearchPickers_ByQuery = async (req: Request, res: Response) => {
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


export const GetPickerSummary_ByQuery = async (req: Request, res: Response) => {
	try {
		const { query: searchQuery } = req.query;

		logger.info(`Received a search query: ${searchQuery}`);

		if (!searchQuery) {
			logger.info(`No search query provided, returning none!`);

			return res.json({
				quoteSummary: {},
				error: false
			});
		}

		const quoteSummary = await yahooFinance.quoteSummary(searchQuery as string);

		return res.json({
			error: false,
			quoteSummary,
		})
	} catch (error) {
		logger.error(error);
		return res.json({
			quoteSummary: [],
			error: true
		});
	}
};


export const GetPickerChartData_ByQuery = async (req: Request, res: Response) => {
	try {
		const { query: searchQuery, interval, start, end } = req.query as GetChartPickerDataQuery;

		logger.info(`Received a search query: ${searchQuery}`);

		if (!searchQuery) {
			logger.info(`No search query provided, returning none!`);

			return res.json({
				chart: {},
				error: false
			});
		}

		let startPeriod = start;

		if (!startPeriod) {
			const currentDate = new Date();
			const oneMonthOld = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;

			startPeriod = currentDate.setMonth(oneMonthOld);
		}

		const chart = await yahooFinance.chart(searchQuery as string, {
			period1: new Date(startPeriod),
			period2: end ?? new Date(),
			interval: interval ?? '15m'
		});

		return res.json({
			error: false,
			chart,
		})
	} catch (error) {
		logger.error(error);
		return res.json({
			chart: [],
			message: error,
			error: true
		});
	}
};