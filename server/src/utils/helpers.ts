import { AnalysisSummaryVerdict, AnalysisSummmary } from '../types/types';
import { logger } from './logger';

export default abstract class helpers {
	static getCalculations({
		eps,
		bookValuePerShare,
		pricePerShare,
		peRatio,
		epsGrowthRate,
		dividendYield = 0,
		returnOnEquity
	}: GetCalculationsParams) {
		const lynchRatio = this.calculateLynchRatio(epsGrowthRate, dividendYield, peRatio);

		logger.info(`Calculating Stats: ${JSON.stringify({
			eps,
			bookValuePerShare,
			pricePerShare,
			peRatio,
			epsGrowthRate,
			dividendYield,
			returnOnEquity
		})}`);

		const calculations = {
			grahamNumber: this.calculateGrahamNumber(eps, bookValuePerShare),
			priceToBookRatio: this.calculatePriceToBookRatio(+pricePerShare, bookValuePerShare),
			pegRatio: this.calculatePEGRatio(peRatio, epsGrowthRate),
			lynchRatio,
			grahamGrowthNumber: this.calculateGrahamGrowthNumber(eps, epsGrowthRate),
			fairValuePrice: eps * epsGrowthRate,
			returnOnEquity: returnOnEquity
		};

		logger.info(`Calculated Stats: ${JSON.stringify(calculations)}`);

		return calculations;
	}

	private static calculateGrahamNumber(eps: number, bookValuePerShare: number) {
		if (!eps || !bookValuePerShare) {
			logger.info('[calculateGrahamNumber()]: EPS or Book Value Per Share is empty!');
			return 0;
		}

		if (eps < 0) {
			logger.info('[calculateGrahamNumber()]: Graham Number is undefined when EPS is negative.');
			return 0;
		}

		const intrinsicValue = Math.sqrt(22.5 * eps * bookValuePerShare);

		return intrinsicValue;
	}

	private static calculateGrahamGrowthNumber(eps: number, expectedGrowthRate: number) {
		if (!eps || !expectedGrowthRate) {
			logger.info('[calculateGrahamGrowthNumber()]: EPS or Expected Growth Rate is empty!');
			return 0;
		}

		if (eps < 0) {
			logger.info('[calculateGrahamGrowthNumber()]: Graham Growth Number is undefined when EPS is negative.');
			return 0;
		}

		return eps * (8.5 + (2 * expectedGrowthRate));
	}

	private static calculatePriceToBookRatio(pricePerShare: number, bookValuePerShare: number) {
		if (!pricePerShare || !bookValuePerShare) {
			logger.info('[calculatePriceToBookRatio()]: Price per share or Book value per share is empty!');
			return 0;
		}

		return (pricePerShare / bookValuePerShare);
	}

	private static calculatePEGRatio(peRatio: number, epsGrowthRate: number) {
		if (!peRatio || !epsGrowthRate) {
			logger.info('[calculatePEGRatio()]: PE Ratio or EPS Growth Rate is empty!');
			return 0;
		}

		return (peRatio / epsGrowthRate);
	}

	private static calculateLynchRatio(epsGrowthRate: number, dividendYield: number, peRatio: number) {
		if (!peRatio || !epsGrowthRate || !dividendYield) {
			logger.info('[calculateLynchRatio()]: PE Ratio or EPS Growth Rate or Dividend Yield is empty!');
			return 0;
		}

		return ((epsGrowthRate + dividendYield) / peRatio);
	}

	public static evaluateStock({
		grahamNumber,
		priceToBookRatio,
		pegRatio,
		lynchRatio,
		grahamGrowthNumber,
		fairValuePrice,
		returnOnEquity,
		currentPrice,
		sector,
	}: EvalueStockParams) {
		const analysis: AnalysisSummmary[] = [];

		// Graham Number comparison
		if (grahamNumber === 0) {
			analysis.push({
				metric: 'Graham Number',
				value: grahamNumber,
				verdict: AnalysisSummaryVerdict.UNRELIABLE,
				interpretation: 'Unreliable — Graham Number is undefined when EPS is negative.',
			});
		} else if (currentPrice < grahamNumber) {
			analysis.push({
				metric: 'Graham Number',
				value: grahamNumber,
				verdict: AnalysisSummaryVerdict.UNDERVALUED,
				interpretation: 'Undervalued — Price is below intrinsic value.',
			});
		} else {
			analysis.push({
				metric: 'Graham Number',
				value: grahamNumber,
				verdict: AnalysisSummaryVerdict.OVERVALUED,
				interpretation: 'Overvalued — Price is above intrinsic value.',
			});
		}

		// Price to Book Ratio
		if (priceToBookRatio === 0) {
			analysis.push({
				metric: 'Price to Book Ratio',
				value: priceToBookRatio,
				verdict: AnalysisSummaryVerdict.UNRELIABLE,
				interpretation: 'Unreliable - Book value per share is empty!',
			});
		} else if (priceToBookRatio < 1) {
			analysis.push({
				metric: 'Price to Book Ratio',
				value: priceToBookRatio,
				verdict: AnalysisSummaryVerdict.UNDERVALUED,
				interpretation: 'Undervalued — Priced below book value.',
			});
		} else if (priceToBookRatio >= 1 && priceToBookRatio <= 1.5) {
			analysis.push({
				metric: 'Price to Book Ratio',
				value: priceToBookRatio,
				verdict: AnalysisSummaryVerdict.FAIR,
				interpretation: 'Fairly Valued — Close to book value.',
			});
		} else {
			analysis.push({
				metric: 'Price to Book Ratio',
				value: priceToBookRatio,
				verdict: AnalysisSummaryVerdict.OVERVALUED,
				interpretation: 'Overvalued — Trading above book value.',
			});
		}

		// PEG Ratio
		if (pegRatio < 1 && pegRatio > 0) {
			analysis.push({
				metric: 'PEG Ratio',
				value: pegRatio,
				verdict: AnalysisSummaryVerdict.UNDERVALUED,
				interpretation: 'Undervalued — Price doesn’t fully reflect growth.',
			});
		} else if (pegRatio >= 1 && pegRatio <= 1.5) {
			analysis.push({
				metric: 'PEG Ratio',
				value: pegRatio,
				verdict: AnalysisSummaryVerdict.FAIR,
				interpretation: 'Fairly Valued — Reasonable pricing for growth.',
			});
		} else if (pegRatio === 0) { 
			analysis.push({
				metric: 'PEG Ratio',
				value: pegRatio,
				verdict: AnalysisSummaryVerdict.UNRELIABLE,
				interpretation: 'Unreliable -  PE Ratio data unavailable.',
			})
		} else {
			analysis.push({
				metric: 'PEG Ratio',
				value: pegRatio,
				verdict: AnalysisSummaryVerdict.OVERVALUED,
				interpretation: 'Overvalued — Price may overestimate growth.',
			});
		}

		// Lynch Ratio
		if (lynchRatio < 1 && lynchRatio > 0) {
			analysis.push({
				metric: 'Lynch Ratio',
				value: lynchRatio,
				verdict: AnalysisSummaryVerdict.OVERVALUED,
				interpretation: 'Overvalued — Price significantly exceeds growth rate.',
			});
		} else if (lynchRatio >= 1 && lynchRatio <= 1.5) {
			// fair
			analysis.push({
				metric: 'Lynch Ratio',
				value: lynchRatio,
				verdict: AnalysisSummaryVerdict.FAIR,
				interpretation: 'Slight Overvaluation — Price higher than growth.',
			});
		} else if (lynchRatio === 0) {
			analysis.push({
				metric: 'Lynch Ratio',
				value: lynchRatio,
				verdict: AnalysisSummaryVerdict.UNRELIABLE,
				interpretation: 'Unreliable — PE Ratio or EPS or Dividend data unavailable.',
			});
		} else {
			analysis.push({
				metric: 'Lynch Ratio',
				value: lynchRatio,
				verdict: AnalysisSummaryVerdict.UNDERVALUED,
				interpretation: 'Undervalued — PEG-style ratio favors buying.',
			});
		}

		// Graham Growth Number
		if (grahamGrowthNumber === 0) {
			analysis.push({
				metric: 'Graham Growth Number',
				value: grahamGrowthNumber,
				verdict: AnalysisSummaryVerdict.UNRELIABLE,
				interpretation: 'Unreliable - Graham growth number becomes unreliable when EPS is negative.'
			});
		} else if (currentPrice < grahamGrowthNumber * 0.9) {
			analysis.push({
				metric: 'Graham Growth Number',
				value: grahamGrowthNumber,
				verdict: AnalysisSummaryVerdict.UNDERVALUED,
				interpretation:
					'Undervalued - The stock appears undervalued based on its earnings growth potential. The market may be underpricing future growth.',
			});
		  } else if (currentPrice > grahamGrowthNumber * 1.1) {
			analysis.push({
			  metric: 'Graham Growth Number',
			  value: grahamGrowthNumber,
			  verdict: AnalysisSummaryVerdict.OVERVALUED,
			  interpretation:
				'Overvalued - The stock appears overvalued relative to its expected earnings growth. Market optimism may be inflating its price.',
			});
		  } else {
			analysis.push({
			  metric: 'Graham Growth Number',
			  value: grahamGrowthNumber,
			  verdict: AnalysisSummaryVerdict.FAIR,
			  interpretation:
				'Fairly Valued - The stock is trading close to its intrinsic value based on earnings growth. It may be fairly valued.',
			});
		  }
		

		// Fair Value Price vs Current Price
		if (fairValuePrice === 0) { 
			analysis.push({
				metric: 'Fair Value Price',
				value: fairValuePrice,
				verdict: AnalysisSummaryVerdict.UNRELIABLE,
				interpretation: 'Unreliable — PE Ratio, Dividend data or EPS unavailable.',
			});
		} else if (currentPrice < fairValuePrice * 0.95) {
			analysis.push({
				metric: 'Fair Value Price',
				value: fairValuePrice,
				verdict: AnalysisSummaryVerdict.UNDERVALUED,
				interpretation: 'Undervalued — Trading below fair value.',
			});
		} else if (currentPrice <= fairValuePrice * 1.05) {
			analysis.push({
				metric: 'Fair Value Price',
				value: fairValuePrice,
				verdict: AnalysisSummaryVerdict.FAIR,
				interpretation: 'Fairly Valued — Close to calculated fair value.',
			});
		} else {
			analysis.push({
				metric: 'Fair Value Price',
				value: fairValuePrice,
				verdict: AnalysisSummaryVerdict.OVERVALUED,
				interpretation: 'Overvalued — Trading above fair value.',
			});
		}

		// Return on Equity
		if (returnOnEquity < 0) {
			analysis.push({
				metric: "Return on Equity",
				value: returnOnEquity,
				verdict: AnalysisSummaryVerdict.OVERVALUED,
				interpretation: "Overvalued - Negative ROE indicates the company is losing money, likely overvalued.",
			});
		} else if (returnOnEquity >= 1.5) {
			analysis.push({
				metric: "Return on Equity",
				value: returnOnEquity,
				verdict: AnalysisSummaryVerdict.UNDERVALUED,
				interpretation: "Undervalued - High ROE suggests efficiency and profitability, stock may be undervalued if paired with low P/B.",
			});
		} else {
			analysis.push({
				metric: "Return on Equity",
				value: returnOnEquity,
				verdict: AnalysisSummaryVerdict.FAIR,
				interpretation: "Fairly Valued - Moderate ROE, requires more analysis for a clearer valuation.",
			});
		}

		const sectorHints: Record<string, string> = {
			financial_services: 'Emphasize Price-to-Book and ROE — banks and insurers rely on efficient use of assets.',
			retail: 'Lynch and Graham Numbers are insightful — consumer-driven pricing and growth matter.',
			industrials: 'ROE and ROIC are vital — watch how well capital is reinvested and utilized.',
			healthcare: 'PEG and Graham Growth are useful — biotech and pharma thrive on growth and R&D.',
			energy: 'Look at ROIC and P/B — capital-intensive, so return on investment is crucial.',
			utilities: 'P/B and stable ROE are key — dividends and steady returns are the focus.',
			realestate: 'Price-to-Book and ROE — asset value and income generation are critical.',
			consumer_defensive: 'PEG and ROE — focus on stability, steady earnings, and moderate growth.',
			communication_services: 'PEG and Lynch — watch user growth and monetization models.',
			basic_materials: 'P/B and ROIC — capital-heavy sector where resource efficiency matters.',
			consumer_cyclical: 'Graham Number and PEG — performance is sensitive to economic cycles.',
			technology: 'PEG and ROE — high valuation is often justified by explosive growth.'
		};

		const sectorTip: string = sectorHints[sector?.toLowerCase()] || 'Look into PEG, ROE, and fair value fundamentals for deeper insight.';

		return {
			summary: analysis,
			sectorTip: sectorTip,
		};
	}
}
