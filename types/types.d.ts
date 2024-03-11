type Portfolio = {
	title: string
	id: string
	type: PortfolioType
	userId: string
	createdAt: Date
	default: boolean
}

type SearchPickerResults = {
	quotes: any[]
}
