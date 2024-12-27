import React from 'react';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, Button, TextInput, StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { URL } from "../utils/api";
import { API_KEY } from "../config";

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;
type Props = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [carparks, setCarparks] = useState<string[][]>([]);
  const [pinnedCarparks, setPinnedCarparks] = useState<string[][]>([])
  const [userInput, setUserInput] = useState<string>('');

  useEffect(() => {
    const fetchCarParks = async () => {
      try{
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
    fetchCarParks();
  }, [])

  const handlePinnedCarParks = (id: string, carpark: string) => {
    setPinnedCarparks((prev) => [...prev, [id, carpark]]);
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
      <ScrollView style={styles.carParkListContainer}>
        {carparks &&
          carparks.filter(([_, carpark]) => carpark.toLowerCase().includes(userInput.toLowerCase())).map(([id, carpark]) => {
            return (
              <TouchableOpacity
                key={id}
                onPress={() => navigation.navigate('Carpark', { facilityId: id, facilityName: carpark })}
              >
                <View style={styles.carParkItemRow}>
                  <Text style={styles.textSize}>{carpark}</Text>
                  <Text style={styles.textSize} onPress={() => {handlePinnedCarParks(id, carpark)}}>Pin</Text>
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