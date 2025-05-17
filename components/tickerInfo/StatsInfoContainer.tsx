import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StatKey } from '@/types/types';

const verdictColors: Record<number, string> = {
	1: '#2e7d32',
	2: '#1976d2',
	3: '#d32f2f',
	4: '#999',
};

const verdictLabels: Record<number, string> = {
	1: 'Undervalued',
	2: 'Fairly Valued',
	3: 'Overvalued',
	4: 'Unreliable',
};

const verdictEmojis: Record<number, string> = {
	1: '✅',
	2: '⚖️',
	3: '❌',
	4: '❓',
};

const STATS_INFO = [
	{
		key: 'fairValuePrice',
		title: 'Fair Value Price',
		sectorTags: ['Tech', 'Consumer Discretionary'],
		formula: 'EPS × EPS Growth Rate',
		whatItMeans: `The Fair Value Price estimates a stock's intrinsic worth based on its current earnings and projected earnings growth. It reflects what the stock should be worth if the company achieves expected growth rates.`,
		interpretation: `- If the current price is below the Fair Value Price, the stock may be undervalued.\n- If it is above, it might be overvalued.\n- A ratio close to 1 indicates fair valuation.`,
		whyItMatters: `In sectors with rapid growth like technology, future earnings potential strongly impacts valuation. This metric helps investors avoid overpaying for hype by grounding valuation in realistic earnings projections.`,
		practicalScenario: `Imagine a tech startup with EPS of $3 and expected growth rate of 15%. Its fair value price would be $3 × 15% = $0.45 (simplified). If the market price is $0.30, it could be undervalued, suggesting a buying opportunity.`,
	},
	{
		key: 'pbRatio',
		title: 'Price-to-Book Ratio (P/B)',
		sectorTags: ['Finance', 'Industrial', 'Energy'],
		formula: 'Market Price per Share ÷ Book Value per Share',
		whatItMeans: `P/B ratio compares the market's valuation of a company to its net asset value. It reflects how much investors are paying for each dollar of net assets.`,
		interpretation: `- P/B < 1 may indicate undervaluation or distressed assets.\n- P/B around 1 suggests market value equals book value.\n- P/B > 3 can mean overvaluation or high growth expectations.`,
		whyItMatters: `In asset-heavy industries, book value is a critical safety net. A low P/B might reveal undervalued stocks, while a high P/B could signal premium pricing for expected growth or intangible assets.`,
		practicalScenario: `Consider a bank trading at a P/B of 0.8. This may suggest the market believes the bank has potential risks or undervalued assets. Investors might research further to find hidden value or warning signs.`,
	},
	{
		key: 'pegRatio',
		title: 'PEG Ratio',
		sectorTags: ['Tech', 'Healthcare'],
		formula: 'P/E Ratio ÷ Annual EPS Growth Rate',
		whatItMeans: `PEG ratio refines the Price-to-Earnings ratio by factoring in earnings growth. It provides a more balanced view of valuation relative to growth.`,
		interpretation: `- PEG < 1 is typically seen as undervalued.\n- PEG ≈ 1 indicates fair value.\n- PEG > 1 may suggest overvaluation.`,
		whyItMatters: `Growth stocks can have high P/E ratios; PEG adjusts for growth to identify stocks that are reasonably priced relative to their earnings growth.`,
		practicalScenario: `A biotech company with P/E of 30 and expected EPS growth of 40% has a PEG of 0.75, indicating it might be undervalued relative to its growth potential, making it attractive for growth investors.`,
	},
	{
		key: 'lynchRatio',
		title: 'Peter Lynch Fair Value (Lynch Ratio)',
		sectorTags: ['Tech', 'Growth'],
		formula: 'Fair Value = EPS × (Growth Rate + 2 × Inflation Rate)',
		whatItMeans: `This valuation metric, introduced by Peter Lynch, adjusts fair value estimates by combining earnings, growth, and inflation to set realistic price targets.`,
		interpretation: `- Price below Lynch Fair Value can indicate a buying opportunity.\n- Price above may signal overvaluation.\n- Useful during inflationary environments.`,
		whyItMatters: `Growth stocks are sensitive to economic factors like inflation. This formula helps balance expected growth against macroeconomic conditions.`,
		practicalScenario: `Assuming EPS $5, growth rate 10%, inflation 3%, Lynch Fair Value = 5 × (10 + 2×3) = 5 × 16 = $80. If stock trades at $70, it may be undervalued considering growth and inflation.`,
	},
	{
		key: 'grahamNumber',
		title: 'Graham Number',
		sectorTags: ['Value Investing', 'Consumer Staples', 'Industrial'],
		formula: '√(22.5 × EPS × Book Value per Share)',
		whatItMeans: `The Graham Number gives a conservative estimate of a stock’s fair value based on earnings and book value, focusing on margin of safety.`,
		interpretation: `- Stock price below Graham Number suggests undervaluation.\n- Price above may be overvalued or growth premium.\n- Useful to identify bargain value stocks.`,
		whyItMatters: `A cornerstone for value investors, it emphasizes safety and fundamentals over market hype, helping to avoid overpriced stocks.`,
		practicalScenario: `A company with EPS $4 and book value $30 has Graham Number √(22.5 × 4 × 30) ≈ $51. If stock price is $40, it could be undervalued with a margin of safety.`,
	},
	{
		key: 'grahamGrowth',
		title: 'Graham Growth Formula',
		sectorTags: ['Finance', 'Value Stocks'],
		formula: 'Intrinsic Value = EPS × (8.5 + 2 × Growth Rate)',
		whatItMeans: `This formula extends Graham's valuation by incorporating growth, estimating a stock’s value with reasonable growth expectations.`,
		interpretation: `- Intrinsic Value above current price indicates undervaluation.\n- Below price may warn of overvaluation.\n- Assumes 8.5 as base P/E for no-growth firms.`,
		whyItMatters: `Balances value and growth, ideal for investors seeking steady companies with moderate growth potential.`,
		practicalScenario: `If EPS is $3 and growth rate is 7%, Intrinsic Value = 3 × (8.5 + 2×7) = 3 × 22.5 = $67.5. Current price below this suggests undervaluation.`,
	},
];

// Helper to mock current value and verdict based on stat
interface StatsInfoContainerProps {
	stat: StatKey;
	verdict: number; // 1 to 4
	currentValue: number;
}

const StatsInfoContainer = ({ stat, currentValue, verdict }: StatsInfoContainerProps) => {
	const item = STATS_INFO.find((s) => s.key === stat);
	if (!item) return null;

	const verdictColor = verdictColors[verdict];

	return (
		<BottomSheetScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>{item.title}</Text>

			<View style={styles.verdictRow}>
				<Text style={[
					styles.verdictLabel,
					{
						borderColor: verdictColor,
						color: verdictColor,
						backgroundColor: `${verdictColor}20`,
					}
				]}>
					{verdictEmojis[verdict]} {verdictLabels[verdict]}
				</Text>
				<View style={styles.badge}>
					<Text style={styles.badgeText}>{currentValue.toFixed(2)}</Text>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionHeader}>Relevant Sectors</Text>
				<View style={styles.sectorTags}>
					{item.sectorTags.map((tag) => (
						<View key={tag} style={styles.sectorTag}>
							<Text style={styles.sectorText}>{tag}</Text>
						</View>
					))}
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionHeader}>Formula</Text>
				<Text style={styles.formula}>{item.formula}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionHeader}>What it means</Text>
				<Text style={styles.details}>{item.whatItMeans}</Text>
				<Text style={[styles.details, { marginTop: 8, fontWeight: '600' }]}>Interpretation:</Text>
				<Text style={styles.details}>{item.interpretation}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionHeader}>Why it matters</Text>
				<Text style={styles.details}>{item.whyItMatters}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionHeader}>Practical Scenario</Text>
				<Text style={styles.details}>{item.practicalScenario}</Text>
			</View>

			<View style={{ height: 40 }} />
		</BottomSheetScrollView>
	);
};

export default StatsInfoContainer;

const styles = StyleSheet.create({
	verdictRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 20
	},
	badge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		backgroundColor: '#f0f0f0',
		borderRadius: 12,
	},
	badgeText: {
		fontSize: 12,
		color: '#444',
	},
	container: {
		padding: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111',
		marginBottom: 12,
	},
	verdictContainer: {
		marginBottom: 20,
	},
	verdictLabel: {
		alignSelf: 'flex-start',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
		borderWidth: 1,
		fontWeight: '500',
		fontSize: 13,
	},
	section: {
		marginBottom: 20,
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 6,
		color: '#222',
	},
	formula: {
		fontSize: 15,
		fontStyle: 'italic',
		color: '#333',
	},
	details: {
		fontSize: 15,
		color: '#333',
		lineHeight: 22,
	},
	sectorTags: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 8,
	},
	sectorTag: {
		backgroundColor: '#007AFF',
		borderRadius: 12,
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginRight: 6,
		marginBottom: 6,
	},
	sectorText: {
		color: '#fff',
		fontSize: 12,
	},
});