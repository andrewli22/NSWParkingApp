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
  const [data, setData] = useState<string[][]>([]);
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
          .then((data: Record<string, string>) => {
            const removeHistorical = Object.entries(data).slice(5);
            const updatedData = removeHistorical.map(([key, value]) => [key, value.slice(12)]);
            updatedData.sort((a, b) => a[1].localeCompare(b[1]));
            setData(updatedData);
          });
      } catch (e) {
        console.error(e)
      }
    };
    fetchCarParks();
  }, [])

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
      <ScrollView style={styles.carParkContainer}>
        <View>
          {data &&
            data.filter(([_, carpark]) => carpark.toLowerCase().includes(userInput.toLowerCase())).map(([id, carpark]) => {
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => navigation.navigate('Carpark', { facilityId: id })}
                >
                  <View>
                    <Text>{carpark}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderStyle: 'solid',
    borderColor: 'red',
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
    width: '80%'
  },
  carParkContainer: {
    flex: 1,
    width: '100%',
    gap: 4
  },
})