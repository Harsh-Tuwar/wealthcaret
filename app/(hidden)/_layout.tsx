import React from 'react';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HiddenLayout() {
	return <GestureHandlerRootView style={{ flex: 1 }}>
		<Slot />
	</GestureHandlerRootView>;
}
