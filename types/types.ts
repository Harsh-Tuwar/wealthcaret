import * as firebaseAuth from 'firebase/auth';

export enum AnalysisSummaryVerdict {
	UNDERVALUED = 1,
	FAIR = 2,
	OVERVALUED = 3,
	UNRELIABLE = 4
}

export type AnalysisSummary = {
	metric: string
	value: number
	interpretation: string
	verdict: AnalysisSummaryVerdict
}

export type Analysis = {
	summary: AnalysisSummary[],
	sectorTip: string
}

export type DetailedPickerData = {
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
	analysis: Analysis
}

export type Portfolio = {
	title: string
	id: string
	type: any
	userId: string
	createdAt: Date
	default: boolean
}

export type PickerQuote = {
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

export type SearchPickerNewsItem = {
	uuid: string
	title: string
	link: string
	publisher: string
	providerPublishTime: string
	type: string
	thumbnail: SearchPickerNewsItemThumbnail
	relatedTickers: string[]
}

export type SearchPickerResults = {
    count: number
	explains: any[]
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

export interface FirestoreUser {
	name: string,
	createAt?: string,
	uid: string,
	dob: string,
	bio: string,
	email?: string,
	phone: string | null
};

export interface AuthStore {
	isLoggedIn: boolean;
	initialized: boolean;
	user: firebaseAuth.User | null;
	fsUser: FirestoreUser | null;
	setUser: (user: firebaseAuth.User | null) => void;
	setLoggedIn: (status: boolean) => void;
	setFsUser: (fsUser: FirestoreUser | null) => void;
}

export interface CreateNewBugReportParams {
	userId: string,
	description: string,
	title: string,
	contact?: string
}

export interface SendFeedbackRequestParams {
	userId: string,
	title: string,
	message: string,
	contact?: string
}

export interface UpdateAccountInfoParams extends FirestoreUser { };
