import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export const handleClearAsync = async () => {
  try {
    await AsyncStorage.clear()
  } catch(e) {
    console.error(e);
  }
}