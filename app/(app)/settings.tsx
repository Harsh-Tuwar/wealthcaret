import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
} from 'react-native';
import Constants from 'expo-constants';
import MenuItem from '@/components/settings/MenuItem';
import { useRouter } from 'expo-router';
import { log } from '@/utils/logger';
import { useAuthStore } from '@/stores/useAuthStore';
import PageHeader from '@/components/ui/PageHeader';

const SettingsScreen = () => {
	const router = useRouter();
	const user = useAuthStore((s) => s.user);
	
	React.useEffect(() => {
		if (!user) {
			log.debug(`Couldn't find user! Returning to where you came from!`);
			router.back();
		}
	}, [user]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<PageHeader title="Settings"  />

			<ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 24 }}>
				<Text style={styles.sectionTitle}>GENERAL</Text>
				<MenuItem icon="person-outline" underline label="Account" onPress={() => { 
					router.push("/(hidden)/settings/account");
					return;
				}} />
	
				<MenuItem icon="article" label="Changelog" underline={false} onPress={() => {
					router.push("/(hidden)/settings/changelog");
				}} />

				<Text style={styles.sectionTitle}>FEEDBACK</Text>
				<MenuItem icon="report-problem" label="Report a bug" underline onPress={() => { 
					router.push("/(hidden)/settings/bug-report-form");
					return;
				}} />
				<MenuItem icon="send" label="Send feedback" underline={false} onPress={() => { 
					router.push("/(hidden)/settings/feedback-form");
					return;
				}} />

				<View style={styles.versionBox}>
					<Text style={styles.versionText}>App version {Constants.expoConfig?.version || '1.0.0'}</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fefefe',
	},
	container: {
		padding: 20,
		paddingTop: 40,
		paddingBottom: 40,
	},
	heading: {
		fontSize: 26,
		fontWeight: '700',
		color: '#1a1a1a',
		textAlign: 'center',
	},
	header: {
		fontSize: 22,
		fontWeight: '700',
		color: '#1C1C1E',
		marginBottom: 18,
		textAlign: 'center',
		letterSpacing: 0.1,
	  },
	headerTitle: {
		fontSize: 20,
		fontWeight: '600',
		marginLeft: 16,
		color: '#1F2937',
	},
	body: {
		paddingHorizontal: 20,
		backgroundColor: '#FFFFFF',
	},
	sectionTitle: {
		fontSize: 12,
		color: '#9CA3AF',
		marginTop: 20,
		marginBottom: 8,
		fontWeight: '600',
	},
	versionText: {
		fontSize: 13,
		color: '#9CA3AF',
	},
	versionBox: {
		marginTop: 40,
		alignItems: 'center',
		paddingVertical: 12,
	},
});

export default SettingsScreen;
