import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './screens/preLogin/LandingScreen';
import LoginScreen from './screens/preLogin/LoginScreen';
import RegistrationScreen from './screens/preLogin/RegistrationScreen';
import HomeScreen from './screens/postLogin/HomeScreen'; // Assuming you have this screen
import ConfirmationScreen from './screens/preLogin/ConfirmationScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

registerRootComponent(App);

export default App;

