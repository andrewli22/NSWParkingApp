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
  const [pinnedCarparks, setPinnedCarparks] = useState<string[][]>([]);
  const [pinnedStatus, setPinnedStatus] = useState<{ [id: string]: boolean }>({});
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
            for (const [id] of updatedData) {
              setPinnedStatus((prev) => ({...prev, [id]: false}));
            }
            setCarparks(updatedData);
          });
      } catch (e) {
        console.error(e)
      }
    };
    fetchCarParks();
  }, [carparks])

  const handlePinnedCarParks = (id: string, carpark: string) => {
    console.log(typeof id);
    console.log(pinnedStatus[id]);
    if (!pinnedStatus[id]) {
      const updatedStatus = { ...pinnedStatus, [id]: true };
      setPinnedStatus(updatedStatus);
      console.log('Updated Status:', updatedStatus);
      // setPinnedCarparks((prev) => ([...prev, [id, carpark]]));
      // const updatedCarpark = carparks.filter((cp) => cp[0] !== id);
      // setCarparks(updatedCarpark);
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
        <Button
          title="pinned Carparks"
          onPress={() => console.log(pinnedCarparks)}
        />
        <Button
          title="pinned status"
          onPress={() => console.log(pinnedStatus)}
        />
        <Button
          title="carparks"
          onPress={() => console.log(carparks.length)}
        />
      </View>
      <ScrollView style={styles.carParkListContainer}>
        {pinnedCarparks &&
          pinnedCarparks.filter(([,carpark]) => carpark.toLowerCase().includes(userInput.toLowerCase())).map(([id, carpark]) => {
            return (
              <TouchableOpacity
                key={id}
                onPress={() => navigation.navigate('Carpark', { facilityId: id, facilityName: carpark })}
              >
                <View style={styles.carParkItemRow}>
                  <Text style={styles.textSize}>{carpark}</Text>
                  <Text style={styles.textSize} onPress={() => {handlePinnedCarParks(id, carpark)}}>{pinnedStatus[id] === false ? 'Pin' : 'Unpin'}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        }
        {carparks &&
          carparks.filter(([,carpark]) => carpark.toLowerCase().includes(userInput.toLowerCase())).map(([id, carpark]) => {
            return (
              <TouchableOpacity
                key={id}
                onPress={() => navigation.navigate('Carpark', { facilityId: id, facilityName: carpark })}
              >
                <View style={styles.carParkItemRow}>
                  <Text style={styles.textSize}>{carpark}</Text>
                  <Text style={styles.textSize} onPress={() => {handlePinnedCarParks(id, carpark)}}>{pinnedStatus[id] === false ? 'Pin' : 'Unpin'}</Text>
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