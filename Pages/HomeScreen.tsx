import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, Button, TextInput, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { URL } from "../utils/api";
import { API_KEY } from "../config";

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;
type Props = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [carPark, setCarPark] = useState<String>('');
  const [data, setData] = useState<string[][]>([]);
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
          setData(updatedData);
        });
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Carpark"
          onChangeText={(text) => setCarPark(text)}
          onSubmitEditing={fetchCarParks}
        />
      </View>
      <View>
        <Text>{carPark}</Text>
      </View>
      <Button title='Next page' onPress={() => navigation.navigate('Search')} />
      <View>
        {data &&
          data.map(([id, carpark]) => {
            return (
              <TouchableOpacity key={id} onPress={() => console.log(id)}>
                <Text>{carpark}</Text>
              </TouchableOpacity>
            );
          })
        }
      </View>
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
  }
})