import React from 'react';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, Button, TextInput, StyleSheet, View, Text, TouchableOpacity, ScrollView, SectionList } from "react-native";
import { URL } from "../utils/api";
import { API_KEY } from "../config";
import { fetchPinnedCarparks, handleStoreCarparks, removePinnedCarpark } from '../utils/storage';
import { SectionDataType, CarParkDataType } from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;
type Props = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<SectionDataType[]>([]);
  const [carparks, setCarparks] = useState<string[][]>([]);
  const [pinnedData, setPinnedData] = useState<SectionDataType[]>([]);
  const [pinnedCarparks, setPinnedCarparks] = useState<{[key: string]: string}>({});
  const [pin, setPin] = useState<boolean>(false);

  useEffect(() => {
    const fetchCarparks = async () => {
      try {
        const response = await fetch(URL+'/carpark', {
          headers: {
            'Authorization': `apikey ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch carparks: ${response.statusText}`);
        }
        const carparks: Record<string, string> = await response.json();
        // Remove historical data and filter out pinned carparks
        const cleanedData = Object.entries(carparks).slice(5)
          .filter(([id]) => !(id in pinnedCarparks))
          .map(([key, value]) => [key, value.slice(12)]);
        const sectionedData: SectionDataType[] = convertToSectionData(groupData(cleanedData));
        sectionedData.sort((a, b) => (a.title.localeCompare(b.title)))

        sectionedData.unshift(transformData(Object.entries(pinnedCarparks)))

        setData(sectionedData);
      } catch (e) {
        console.error(e)
      }
    };
    fetchCarparks();
  }, []);

  // Group data by first letter of carpark name
  const groupData = (data: string[][]) => {
    return data.reduce((acc, [id, carpark]) => {
      const firstLetter = carpark.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push({ id, name: carpark });
      return acc;
    }, {} as Record<string, CarParkDataType[]>);
  };

  const convertToSectionData = (groupedData: Record<string, CarParkDataType[]>) => {
    return Object.entries(groupedData).map(([title, data]) => ({ title, data }));
  };

  const transformData = (pinnedCP: string[][]) => {
    return {
      title: 'Pinned',
      data: pinnedCP.map((cp) => ({
        id: cp[0],
        name: cp[1]
      }))
    };
  }

  useEffect(() => {
    const getPinnedCP = async () => {
      const res = await fetchPinnedCarparks();
      setPinnedCarparks(res);
    }
    getPinnedCP();
  }, [pin])

  const handlePinCarpark = async (id: string, carpark: string) => {
    await handleStoreCarparks({ id, carpark });
    const firstCh = carpark.charAt(0);
    // Remove carpark from corresponding section
    const tempData = data;
    const section = tempData.find((section) => (section.title === firstCh));
    if (section) {
      section.data = section.data.filter((cp) => (cp.id !== id));
    }
    // Add carpark to pinned section
    // setCarparks((prev) => (prev.filter((cp) => cp[0] !== id)));
    // setPin(!pin)
  }

  const handleUnpinCarpark = async (id: string, carpark: string) => {
    await removePinnedCarpark(id);
    setCarparks((prev) => ([...prev, [id, carpark]]));
    setPin(!pin);
  }

  const handleClearAsync = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
        <Button
          title='clear'
          onPress={() => handleClearAsync()}
        />
        <SectionList
          style={styles.carParkListContainer}
          sections={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Carpark', { 
                facilityId: item.id,
                facilityName: item.name 
              })}
            >
              <View style={styles.carParkItemRow}>
                <Text style={styles.textSize}>{item.name}</Text>
                <Button 
                  title='pin' 
                  onPress={() => handlePinCarpark(item.id, item.name)}
                />
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title }}) => (
            <View>
              <Text>{title}</Text>
            </View>
          )}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    width: '100%',
    padding: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  inputContainer: {
    width: '80%',
    margin: 10
  },
  carParkListContainer: {
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 20
  },
  carParkItemRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 10
  },
  textSize: {
    fontSize: 16
  }
})