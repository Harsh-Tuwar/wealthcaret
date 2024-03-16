type Portfolio = {
	title: string
	id: string
	type: PortfolioType
	userId: string
	createdAt: Date
	default: boolean
}

type PickerQuote = {
	exchange: string
	shortname: string
	quoteType: string
	symbol: string
	index: string
	score: number
	typeDisp: string
	longname: string
	exchDisp: string
	sector: string
	sectorDisp: string
	industry: string
	industryDisp: string
	isYahooFinance: boolean
}

type SearchPickerNewsItemThumbnailResolutionItem = {
	url: string
	width: string
	height: string
	tag: string
}

type SearchPickerNewsItemThumbnail = {
	resolutions: SearchPickerNewsItemThumbnailResolutionItem[]
}

type SearchPickerNewsItem = {
	uuid: string
	title: string
	link: string
	publisher: string
	providerPublishTime: string
	type: string
	thumbnail: SearchPickerNewsItemThumbnail
	relatedTickers: string[]
}

type SearchPickerResults = {
    count: number
	explains: any[]
    quotes: PickerQuote[]
    news: SearchPickerNewsItem[]
    nav: any[]
    lists: any[]
    researchReports: any[]
    screenerFieldResults: any[]
    totalTime: number
    timeTakenForQuotes: number
    timeTakenForNews: number
    timeTakenForAlgowatchlist: number
    timeTakenForPredefinedScreener: number
    timeTakenForCrunchbase: number
    timeTakenForNav: number
    timeTakenForResearchReports:  number
    timeTakenForScreenerField: number
    timeTakenForCulturalAssets: number
	quotes: PickerQuote[]
}
