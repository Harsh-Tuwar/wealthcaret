import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import changelog from '@/assets/changelog.json';
import PageHeader from '@/components/ui/PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

type ChangeItem = {
	text: string;
	type?: 'bugfix' | 'addition' | 'update' | 'refactor' | string;
};

type ChangelogEntry = {
	version: string;
	date: string;
	changes: ChangeItem[];
};

const typeColorMap: Record<string, string> = {
	bugfix: '#EF4444',    // red
	addition: '#10B981',  // green
	update: '#3B82F6',    // blue
	refactor: '#F59E0B',  // orange
	default: '#6B7280'    // gray
};

const ChangelogScreen = () => {
	const [entries, setEntries] = useState<ChangelogEntry[]>([]);
	const router = useRouter();

	useEffect(() => {
		const sorted = [...(changelog as ChangelogEntry[])].sort((a, b) =>
			new Date(a.date).getTime() - new Date(b.date).getTime()
		);
		setEntries(sorted);
	}, []);

	const getBadgeColor = (type?: string) => {
		if (!type) return typeColorMap.default;
		return typeColorMap[type.toLowerCase()] || typeColorMap.default;
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<PageHeader
				title='Changelog'
				leftButton={{
					icon: 'arrow-back',
					onPress: () => router.back()
				}}
			/>

			<ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
				{entries.map((entry, idx) => (
					<View key={idx} style={styles.entry}>
						<View style={styles.headerRow}>
							<Text style={styles.version}>🏷️ v{entry.version}</Text>
							<Text style={styles.date}>{entry.date}</Text>
						</View>
						{entry.changes.map((change, i) => (
							<View key={i} style={styles.changeRow}>
								<View
									style={[
										styles.badge,
										{ backgroundColor: getBadgeColor(change.type) }
									]}
								>
									<Text style={styles.badgeText}>{change.type || 'note'}</Text>
								</View>
								<Text style={styles.changeText}>{change.text}</Text>
							</View>
						))}
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		marginTop: -24,
		backgroundColor: '#fefefe',
	},
	body: {
		paddingHorizontal: 20,
		paddingTop: 15,
		backgroundColor: '#FFFFFF',
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	entry: {
		marginBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E7EB',
		paddingBottom:4,
	},
	version: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
	},
	date: {
		fontSize: 12,
		color: '#6B7280',
	},
	changeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	changeText: {
		fontSize: 14,
		color: '#374151',
		marginLeft: 8,
		flexShrink: 1,
	},
	badge: {
		borderRadius: 6,
		paddingVertical: 2,
		paddingHorizontal: 8,
	},
	badgeText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#fff',
		textTransform: 'capitalize',
	},
});

export default ChangelogScreen;
