import React, { useMemo } from 'react';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, Button, TextInput, StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { URL } from "../utils/api";
import { API_KEY } from "../config";
import { fetchPinnedCarparks, handleStoreCarparks, removePinnedCarpark } from '../utils/storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;
type Props = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [carparks, setCarparks] = useState<string[][]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [pinnedCarparks, setPinnedCarparks] = useState<{[key: string]: string}>({});
  const [pin, setPin] = useState<boolean>(false);

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
            let removeHistorical = Object.entries(carparks).slice(5);
            removeHistorical = removeHistorical.filter((cp) => !(cp[0] in pinnedCarparks));
            const updatedData = removeHistorical.map(([key, value]) => [key, value.slice(12)]);
            setCarparks(updatedData);
          });
      } catch (e) {
        console.error(e)
      }
    };
    fetchCarparks();
  }, []);

  useEffect(() => {
    const getPinnedCP = async () => {
      const res = await fetchPinnedCarparks();
      setPinnedCarparks(res);
    }
    getPinnedCP();
  }, [pin])

  const handlePinCarpark = async (id: string, carpark: string) => {
    await handleStoreCarparks({ id, carpark });
    setCarparks((prev) => (prev.filter((cp) => cp[0] !== id)));
    setPin(!pin)
  }

  const handleUnpinCarpark = async (id: string, carpark: string) => {
    await removePinnedCarpark(id);
    setCarparks((prev) => ([...prev, [id, carpark]]));
    setPin(!pin);
  }

  const filteredAndSortedCarparks = useMemo(() => {
    return (carparks
      .filter(([,carpark]) => carpark.toLowerCase().includes(userInput.toLowerCase()))
      .sort((a, b) => a[1].localeCompare(b[1]))
    );
  }, [carparks, userInput]);

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
        {pinnedCarparks &&
        
          Object.entries(pinnedCarparks).map(([id, carpark]) => {
            return (
              <TouchableOpacity
                key={id}
                onPress={() => navigation.navigate('Carpark', { facilityId: id, facilityName: carpark })}
              >
                <View style={styles.carParkItemRow}>
                  <Text style={styles.textSize}>{carpark}</Text>
                  <Button title='unpin' onPress={() => handleUnpinCarpark(id, carpark)}/>
                </View>
              </TouchableOpacity>
            )
          })

        }
        {carparks &&
          filteredAndSortedCarparks.map(([id, carpark]) => {
            return (
              <TouchableOpacity
                key={id}
                onPress={() => navigation.navigate('Carpark', { facilityId: id, facilityName: carpark })}
              >
                <View style={styles.carParkItemRow}>
                  <Text style={styles.textSize}>{carpark}</Text>
                  <Button title='pin' onPress={() => handlePinCarpark(id, carpark)}/>
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