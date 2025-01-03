import React, { SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChildProps {
	id: string,
	carpark: string,
	setUserPin: React.Dispatch<SetStateAction<boolean>>
}

export const handlePinnedCarparks = async ({ id, carpark, setUserPin }: ChildProps) => {
	try {
		const currCarparks = await loadPinnedCarparks();
		console.log("pinning carpark");
		if (!(id in currCarparks)) {
			currCarparks[id] = carpark
			console.log("addded carpark");
		}
		await AsyncStorage.setItem('pinnedCarparks', JSON.stringify(currCarparks));
		setUserPin(true);
	} catch (e) {
		console.error(e);
	}
}

export const loadPinnedCarparks = async () => {
	try {
		const getCarparks = await AsyncStorage.getItem('pinnedCarparks')
		return getCarparks != null ? JSON.parse(getCarparks) : {};
	} catch (e) {
		console.error(e);
	}
}
