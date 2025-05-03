import { MaterialIcons, Feather } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

const MenuItem = ({ icon, label, onPress, underline = true }: {
	icon: any,
	label: string,
	onPress: VoidFunction,
	underline: boolean
}) => (
	<TouchableOpacity
      style={[styles.menuItem, !underline && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconLabel}>
        <MaterialIcons name={icon} size={22} color="#4B5563" />
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
	menuItem: {
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderColor: '#F3F4F6',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	iconLabel: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	versionBox: {
		marginTop: 40,
		alignItems: 'center',
		paddingVertical: 12,
	},
	menuText: {
		fontSize: 16,
		marginLeft: 16,
		color: '#374151',
	},
})

export default MenuItem;
