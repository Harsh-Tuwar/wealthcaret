import { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const StatsInfoContainer = () => {
	return (
		<BottomSheetView style={styles.contentContainer}>
			<Text>Awesome from component 🎉</Text>
		</BottomSheetView>
	)
}

export default StatsInfoContainer;

const styles = StyleSheet.create({
	contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
})