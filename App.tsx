// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './Pages/HomeScreen';
import { CarparkScreen } from './Pages/CarparkScreen';
import { RootStackParamList } from './utils/types';

export default function App() {
  const RootStack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName='Home'>
        <RootStack.Screen name='Home' component={HomeScreen} />
        <RootStack.Screen name='Carpark' component={CarparkScreen} options={({route}) => ({ title: route.params.facilityName })}/>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
