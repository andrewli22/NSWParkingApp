import React, { SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChildProps {
	id: string,
	carpark: string,
}

export const handleStoreCarparks = async ({ id, carpark }: ChildProps) => {
	try {
		const currCarparks = await fetchPinnedCarparks();
		if (!(id in currCarparks)) {
			currCarparks[id] = carpark
		}
		await AsyncStorage.setItem('pinnedCarparks', JSON.stringify(currCarparks));
	} catch (e) {
		console.error(e);
	}
}

export const fetchPinnedCarparks = async () => {
	try {
		const getCarparks = await AsyncStorage.getItem('pinnedCarparks')
		return getCarparks != null ? JSON.parse(getCarparks) : {};
	} catch (e) {
		console.error(e);
	}
}

export const removePinnedCarpark = async (id: string) => {
	try {
		const getCarparks = await AsyncStorage.getItem('pinnedCarparks');
    if (getCarparks) {
      const carparks = JSON.parse(getCarparks);
			delete carparks[id]
			await AsyncStorage.setItem('pinnedCarparks', JSON.stringify(carparks));
    } else {
      console.log("No pinned carparks found.");
    }
	} catch (e) {
		console.error(e);
	}
}