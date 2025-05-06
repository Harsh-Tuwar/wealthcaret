import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createNewBugReport } from '@/stores/useSettingStore';
import { useAuthStore } from '@/stores/useAuthStore';

const BugReportForm = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [contact, setContact] = useState('');
	const user = useAuthStore((s) => s.user);
	const router = useRouter();

	const handleSubmit = async () => {
		if (!title.trim() || !description.trim()) {
			Alert.alert('Error', 'Please fill in both the title and description.');
			return;
		}

		await createNewBugReport({
			userId: user?.uid ?? 'unknown',
			title,
			description,
			contact,
		});

		Alert.alert('Thank you!', 'Your bug report has been submitted.');
		router.back();
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
				<Ionicons name="arrow-back" size={24} color="#333" />
			</TouchableOpacity>

			<ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
				<Text style={styles.header}>Search Stocks</Text>

				<Text style={styles.label}>Title</Text>
				<TextInput
					style={styles.input}
					placeholder="Give a short title for the bug"
					value={title}
					onChangeText={setTitle}
				/>

				<Text style={styles.label}>Description</Text>
				<TextInput
					style={[styles.input, styles.textArea]}
					placeholder="Describe the bug in detail..."
					multiline
					numberOfLines={5}
					value={description}
					onChangeText={setDescription}
				/>

				<Text style={styles.label}>Contact info (optional)</Text>
				<TextInput
					style={styles.input}
					placeholder="Email or phone"
					value={contact}
					onChangeText={setContact}
				/>

				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Submit Report</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fefefe',
	},
	backButton: {
		position: 'absolute',
		top: 20,
		left: 20,
		padding: 10,
		zIndex: 10,
	},
	body: {
		padding: 20,
		paddingTop: 40,
		paddingBottom: 40,
	},
	header: {
		fontSize: 22,
		fontWeight: '700',
		color: '#1C1C1E',
		marginBottom: 18,
		textAlign: 'center',
		letterSpacing: 0.1,
	  },
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
		marginTop: 20,
	},
	input: {
		borderColor: '#D1D5DB',
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		fontSize: 14,
		backgroundColor: '#F9FAFB',
		color: '#111827',
	},
	textArea: {
		height: 120,
		textAlignVertical: 'top',
	},
	button: {
		marginTop: 30,
		backgroundColor: '#2563EB',
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600',
	},
});

export default BugReportForm;
