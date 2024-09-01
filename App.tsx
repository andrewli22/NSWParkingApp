// import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './Pages/HomeScreen';
import { SearchScreen } from './Pages/SearchScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  const [carpark, setCarpark] = useState<String>('');

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Search' component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});

const inputStyle = StyleSheet.create({
  textInput: {
    borderStyle: 'solid',
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 5,
    width: '80%',
    padding: 10,
  }
})
