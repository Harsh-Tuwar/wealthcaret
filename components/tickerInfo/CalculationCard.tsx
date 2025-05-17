import React from 'react'
import { Analysis, StatKey } from '@/types/types';
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface CalculationCardProps {
	label: string,
	value: number | undefined,
	analysisKey: string,
	analysis: Analysis,
	showDollarSign?: boolean,
	onPress: VoidFunction,
	emojiKey: StatKey
}

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

const titleEmojisMap: Record<StatKey, string> = {
	'fairValuePrice': '📈',
	'pbRatio': '🏦',
	'pegRatio': '⚖️',
	'lynchRatio': '🧠',
	'grahamNumber': '🛡️',
	'grahamGrowth': '🌱',
	'': '😵'
}

const CalculationCard = ({
	analysis,
	analysisKey,
	label,
	value,
	emojiKey,
	showDollarSign = false,
	onPress
}: CalculationCardProps) => {
	const analysisMap: Record<string, { verdict: number, interpretation: string, metric: string, value: number }> = (analysis?.summary || [])
		.reduce(
			(
				acc,
				curr
			) => {
				acc[curr.metric as string] = curr;
				return acc;
			}, {} as Record<string, { verdict: number, interpretation: string, metric: string, value: number }>);

	if (value === undefined) return null;

	const analysisItem = analysisMap[analysisKey];
	const verdictColor: string = analysisItem ? verdictColors[analysisItem.verdict] : '#ccc';
	const verdictLabel: string = analysisItem ? verdictLabels[analysisItem.verdict] : 'Unknown';
	const emoji: string = analysisItem ? verdictEmojis[analysisItem.verdict] : '❓';
	const interpretation = analysisItem?.interpretation;
	const titleEmoji: string = titleEmojisMap[emojiKey];
	
	return (
		<View style={styles.calculationCard} key={label}>
			<Pressable onPress={onPress}>
				<View style={styles.cardHeader}>
					<Text style={styles.calculationLabel}>{titleEmoji} {label}</Text>
					<Text style={[styles.verdictLabel, { color: verdictColor }]}>
						{emoji} {verdictLabel}
					</Text>
				</View>
				<Text style={styles.calculationValue}>{showDollarSign && "$"}{value && value.toFixed(2)}</Text>
				{interpretation && (
					<Text style={styles.interpretation}>{interpretation}</Text>
				)}
			</Pressable>
		</View>
	);
}

export default CalculationCard;

const styles = StyleSheet.create({
	calculationCard: {
		backgroundColor: '#f7f7f7',
		padding: 14,
		borderRadius: 8,
		marginBottom: 14,
		borderColor: '#eee',
		borderWidth: 1,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	calculationLabel: {
		fontSize: 14,
		color: '#777',
	},
	calculationValue: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginTop: 5,
	},
	verdictLabel: {
		fontSize: 13,
		fontWeight: '600',
	},
	interpretation: {
		marginTop: 5,
		fontSize: 13,
		color: '#555',
	}
});
