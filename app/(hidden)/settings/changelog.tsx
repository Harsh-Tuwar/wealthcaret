import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import changelog from '@/assets/changelog.json';

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
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<Ionicons name="arrow-back" size={24} color="#1C1C1E" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Changelog</Text>
			</View>

			<ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
				{entries.map((entry, idx) => (
					<View key={idx} style={styles.entry}>
						<Text style={styles.version}>v{entry.version}</Text>
						<Text style={styles.date}>{entry.date}</Text>
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
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingTop: 40,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '700',
		marginLeft: 12,
		color: '#1C1C1E',
	},
	entry: {
		marginBottom: 30,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E7EB',
		paddingBottom: 16,
	},
	version: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
	},
	date: {
		fontSize: 14,
		color: '#6B7280',
		marginBottom: 12,
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
