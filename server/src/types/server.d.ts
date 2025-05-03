type ChartOptionsInterval = "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo";

type GetChartPickerDataQuery = {
	query: string,
	interval: ChartOptionsInterval,
	start: Date | string | number,
	end: Date | string | number
}

type MarketStatusReqResponse = {
	market_type: string;
	region: string;
	primary_exchanges: string;
	local_open: string;
	local_close: string;
	current_status: string;
	notes: string;
}

type GetCalculationsParams = {
	eps: number,
	bookValuePerShare: number
	pricePerShare: number
	peRatio: number
	epsGrowthRate: number
	dividendYield: number,
	returnOnEquity: number
};

type EvalueStockParams = {
	grahamNumber: number
	priceToBookRatio: number
	pegRatio: number 
	lynchRatio: number
	grahamGrowthNumber: number
	fairValuePrice: number
	returnOnEquity: number
	currentPrice: number
	sector: string
}

