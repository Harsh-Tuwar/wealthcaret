export enum AnalysisSummaryVerdict {
	UNDERVALUED = 1,
	FAIR = 2,
	OVERVALUED = 3,
	UNRELIABLE = 4
}

export type AnalysisSummmary = {
	key: string,
	metric: string
	value: string | number | null
	interpretation: string,
	verdict: AnalysisSummaryVerdict
}

export type TickerDataResponse = {
	pricePerShare?: number | string
	peRatio?: number
	dividend?: number
	eps?: number
	epsGrowthRate?: number
	currency?: string
	bookValuePerShare?: number
	dividendYield?: number
	freeCashFlow?: number
	marketCap?: number
	symbol?: string
	name?: string
	sector?: string
	fiftyTwoWeekRange?: {
		low: number
		high: number
	}
	calculations?: {
		grahamNumber: number
		priceToBookRatio: number
		pegRatio: number
		lynchRatio: number
		grahamGrowthNumber: number
		fairValuePrice: number
		returnOnEquity: number
	},
	analysis?: {
		summary: AnalysisSummmary[]
		sectorTip: string
	}
}

