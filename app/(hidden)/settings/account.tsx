import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	Alert,
	Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { appSignOut, useAuthStore } from '@/stores/useAuthStore';
import { updateAccountInfo } from '@/stores/useSettingStore';
import DateTimePicker from '@react-native-community/datetimepicker';

const AccountProfileScreen = () => {
	const user = useAuthStore((s) => s.fsUser);
	const router = useRouter();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [bio, setBio] = useState('');
	const [dob, setDob] = useState<Date | null>(null);
	const [showDatePicker, setShowDatePicker] = useState(false);

	useEffect(() => {
		if (user) {
			setName(user.name || '');
			setPhone(user.phone || '');
			setBio(user.bio || '');
			setDob(user.dob ? new Date(user.dob) : null);
		}
	}, [user]);

	const handleSave = async () => {
		if (!user) {
			Alert.alert('We are having some issues finding your information. Please try again later!');
			router.back(); // Adjust to your login route
			return;
		}
			
		if (!name.trim()) {
			Alert.alert('Validation Error', 'Name cannot be empty.');
			return;
		}

		await updateAccountInfo({
			uid: user.uid,
			name,
			phone,
			bio,
			email: user.email,
			dob: (dob ?? new Date()).toISOString().split('T')[0], // YYYY-MM-DD
		});

		Alert.alert('Success', 'Your profile has been updated.');
		router.back();
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setDob(selectedDate);
		}
	};

	const handleLogout = async () => {
		const resp = await appSignOut();

		if (!resp?.error) {
			router.replace('/(auth)/login');
		} else {
			console.log(resp?.error);
			Alert.alert('Logout error!', (resp?.error as any)?.message);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
				<Ionicons name="arrow-back" size={24} color="#333" />
			</TouchableOpacity>

			<ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
				<Text style={styles.header}>Your Profile</Text>

				<Text style={styles.label}>Email (read-only)</Text>
				<TextInput
					style={[styles.input, styles.disabledInput]}
					value={user?.email}
					editable={false}
				/>

				<Text style={styles.label}>Full Name</Text>
				<TextInput
					style={styles.input}
					placeholder="Your full name"
					value={name}
					onChangeText={setName}
				/>

				<Text style={styles.label}>Phone Number</Text>
				<TextInput
					style={styles.input}
					placeholder="e.g. +1 416 123 4567"
					value={phone}
					onChangeText={setPhone}
					keyboardType="number-pad"
				/>

				<Text style={styles.label}>Date of Birth</Text>
				<TouchableOpacity
					style={styles.input}
					onPress={() => setShowDatePicker(true)}
					activeOpacity={0.8}
				>
					<Text style={{ color: dob ? '#111827' : '#9CA3AF' }}>
						{dob ? dob.toISOString().split('T')[0] : 'Select your birth date'}
					</Text>
				</TouchableOpacity>
				{showDatePicker && (
					<DateTimePicker
						value={dob || new Date()}
						mode="date"
						display={Platform.OS === 'ios' ? 'spinner' : 'default'}
						maximumDate={new Date()}
						onChange={handleDateChange}
					/>
				)}

				<Text style={styles.label}>Bio</Text>
				<TextInput
					style={[styles.input, styles.textArea]}
					placeholder="Tell us about yourself..."
					multiline
					numberOfLines={4}
					value={bio}
					onChangeText={setBio}
				/>

				<TouchableOpacity style={styles.button} onPress={async () => handleSave()}>
					<Text style={styles.buttonText}>Save Changes</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
					<Text style={styles.logoutText}>Logout</Text>
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
	},
	header: {
		fontSize: 22,
		fontWeight: '700',
		color: '#1C1C1E',
		marginBottom: 20,
		textAlign: 'center',
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
	disabledInput: {
		backgroundColor: '#E5E7EB',
		color: '#6B7280',
	},
	textArea: {
		height: 100,
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
	logoutButton: {
		marginTop: 20,
		alignItems: 'center',
	},
	logoutText: {
		color: '#EF4444',
		fontSize: 14,
		fontWeight: '600',
	},
});

export default AccountProfileScreen;
