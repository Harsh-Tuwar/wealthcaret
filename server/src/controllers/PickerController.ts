import yahooFinance from 'yahoo-finance2';
import { Request, Response } from 'express';

import helpers from '../utils/helpers';
import { logger } from '../utils/logger';
import { TickerDataResponse } from '../types/types';

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

		const response = await yahooFinance.search(searchQuery as string, { region: 'US',  });

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

export const GetPickerData_ByQuery = async (req: Request, res: Response) => {
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

export const GetPickerDetailedData_ByQuery = async (req: Request, res: Response) => {
	try {
		const { picker } = req.query;

		logger.info(`Received a detailed query request: ${picker}`);

		if (!picker) {
			logger.info(`No picker provided, returning empty response!`);

			return res.json({
				data: {},
				error: false,
				reason: 'No picker provided in the query string!'
			});
		}

		const modulerStockData = await yahooFinance.quoteSummary(picker as string, {
			modules: [
				'assetProfile',
				'earningsTrend',
				'price',
				'summaryDetail',
				'financialData',
				'defaultKeyStatistics',
				'cashflowStatementHistory'
			]
		});

		let tickerData: TickerDataResponse = {
			pricePerShare: modulerStockData.price.regularMarketPrice,
			symbol: modulerStockData.price.symbol,
			currency: modulerStockData.price.currency,
			name: modulerStockData.price.longName,
			marketCap: modulerStockData.price.marketCap,
			bookValuePerShare: modulerStockData.defaultKeyStatistics.bookValue,
			eps: modulerStockData.defaultKeyStatistics.trailingEps,
			sector: modulerStockData.assetProfile.sector,
			peRatio: modulerStockData.summaryDetail.trailingPE,
			dividend: modulerStockData.summaryDetail.dividendRate,
			dividendYield: modulerStockData.summaryDetail.dividendYield,
			fiftyTwoWeekRange: {
				low: modulerStockData.summaryDetail.fiftyTwoWeekLow,
				high: modulerStockData.summaryDetail.fiftyTwoWeekHigh
			},
		};

		if (modulerStockData.earningsTrend.trend.length) {
			const nextYear = modulerStockData.earningsTrend.trend?.find((t) => t.period === '+1y');
			tickerData.epsGrowthRate = (nextYear.growth * 100);
		}

		tickerData.calculations = helpers.getCalculations({
			eps: tickerData.eps,
			bookValuePerShare: tickerData.bookValuePerShare,
			pricePerShare: +tickerData.pricePerShare,
			peRatio: tickerData.peRatio,
			epsGrowthRate: tickerData.epsGrowthRate,
			dividendYield: tickerData.dividendYield * 100,
			returnOnEquity: modulerStockData.financialData.returnOnEquity
		});

		tickerData.analysis = helpers.evaluateStock({
			currentPrice: parseFloat(tickerData.pricePerShare.toString()),
			fairValuePrice: tickerData.calculations.fairValuePrice,
			grahamGrowthNumber: tickerData.calculations.grahamGrowthNumber,
			grahamNumber: tickerData.calculations.grahamNumber,
			lynchRatio: tickerData.calculations.lynchRatio,
			pegRatio: tickerData.calculations.pegRatio,
			priceToBookRatio: tickerData.calculations.priceToBookRatio,
			returnOnEquity: tickerData.calculations.returnOnEquity,
			sector: tickerData.sector.replace(' ', '_'),
		})

		return res.json({
			error: false,
			data: tickerData,
		});
	} catch (error) {
		logger.error(error);
		return res.json({
			message: error,
			error: true
		});
	}
};
