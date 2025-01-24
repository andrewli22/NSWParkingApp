// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, CarparkScreen, FeedbackScreen } from './Pages';
import { RootStackParamList } from './utils/types';
import { createDrawerNavigator } from '@react-navigation/drawer';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const DrawerStack = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <DrawerStack.Navigator initialRouteName='Home'>
      <DrawerStack.Screen
        name='Home'
        component={HomeScreen}
      />
      <DrawerStack.Screen
        name='Feedback'
        component={FeedbackScreen}
      />
    </DrawerStack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name='HomeDrawer' component={HomeDrawer} options={{ title: 'Home' }}/>
        <RootStack.Screen name='Carpark' component={CarparkScreen} options={({route}) => ({ title: route.params.facilityName, headerShown: true })}/>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
