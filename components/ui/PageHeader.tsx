import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface IconButtonProps {
	icon: keyof typeof MaterialIcons.glyphMap;
	onPress: () => void;
}

interface PageHeaderProps {
	title: string;
	titleAlign?: 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch';
	leftButton?: IconButtonProps;
	rightButton?: IconButtonProps;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, leftButton, rightButton, titleAlign = "center" }) => {
	return (
		<View style={styles.headerContainer}>
			{leftButton && (
				<View style={styles.sideButton}>
						<TouchableOpacity
							onPress={leftButton.onPress}
							hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						>
							<MaterialIcons name={leftButton.icon} size={24} color="#1F2937" />
						</TouchableOpacity>
				</View>
			)}

			<View style={{ ...styles.titleContainer, alignItems: titleAlign }}>
				<Text style={styles.title}>{title}</Text>
			</View>

			{rightButton && (
				<View style={styles.sideButton}>
					<TouchableOpacity
						onPress={rightButton.onPress}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					>
						<MaterialIcons name={rightButton.icon} size={24} color="#1F2937" />
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		paddingHorizontal: 15,
		paddingBottom: 15,
		paddingTop: 28,
		backgroundColor: '#fff'
	},
	sideButton: {
		width: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleContainer: {
		flex: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1F2937',
	},
});

export default PageHeader;
