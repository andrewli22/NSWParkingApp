import React from 'react';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, Button, TextInput, StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { URL } from "../utils/api";
import { API_KEY } from "../config";
import { loadPinnedCarparks, handlePinnedCarparks } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;
type Props = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [carparks, setCarparks] = useState<string[][]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [pinnedCarparks, setPinnedCarparks] = useState<{ [key: string]: string }>({});
  const [userPin, setUserPin] = useState<boolean>(false);

  useEffect(() => {
    const fetchCarparks = async () => {
      try {
        fetch(URL+'/carpark', {
          headers: {
            'Authorization': `apikey ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        })
          .then((res) => res.json())
          .then((carparks: Record<string, string>) => {
            const removeHistorical = Object.entries(carparks).slice(5);
            const updatedData = removeHistorical.map(([key, value]) => [key, value.slice(12)]);
            updatedData.sort((a, b) => a[1].localeCompare(b[1]));
            setCarparks(updatedData);
          });
      } catch (e) {
        console.error(e)
      }
    };
    const getPinnedCarparks = async () => {
      try {
        const loadCarparks = await loadPinnedCarparks();
        console.log("loading carparks");
        console.log(loadCarparks);
        setPinnedCarparks(loadCarparks);
        setUserPin(false);
     } catch (e) {
        console.error(e);
      }
    }
    getPinnedCarparks();
    fetchCarparks();
  }, [userPin]);

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('clearing storage');
      setPinnedCarparks({});
      setUserPin(!userPin);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Carpark"
          onChangeText={(text) => setUserInput(text)}
        />
      </View>
      <View>
        <Button 
          title='asyncstorage'
          onPress={() => console.log(pinnedCarparks)}
        />
        <Button 
          title='clear storage'
          onPress={() => {handleClearStorage()}}
        />
      </View>
      <ScrollView style={styles.carParkListContainer}>
        {carparks &&
          carparks.filter(([,carpark]) => carpark.toLowerCase().includes(userInput.toLowerCase())).map(([id, carpark]) => {
            return (
              <TouchableOpacity
                key={id}
                onPress={() => navigation.navigate('Carpark', { facilityId: id, facilityName: carpark })}
              >
                <View style={styles.carParkItemRow}>
                  <Text style={styles.textSize}>{carpark}</Text>
                  <Button title='pin' onPress={() => {handlePinnedCarparks({ id, carpark, setUserPin })}}/>
                </View>
              </TouchableOpacity>
            );
          })
        }
      </ScrollView>
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