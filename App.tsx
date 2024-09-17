import React, { useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import LandingScreen from './screens/preLogin/LandingScreen';
import LoginScreen from './screens/preLogin/LoginScreen';
import RegistrationScreen from './screens/preLogin/RegistrationScreen';
import ConfirmationScreen from './screens/preLogin/ConfirmationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/postLogin/HomeScreen';
import SearchScreen from './screens/postLogin/SearchScreen';
import LibraryScreen from './screens/postLogin/LibraryScreen';
import SettingsScreen from './screens/postLogin/SettingsScreen';
import { AppRegistry, StatusBar, StyleSheet, View } from 'react-native';
import HistoryScreen from './screens/postLogin/HistoryScreen';
import supabase from './services/supabase';
import ProfileScreen from './screens/postLogin/ProfileScreen';
import { UserProvider } from './components/context/UserContext';
import PlaylistScreen from './screens/postLogin/PlaylistScreen';
import { TrackPlayerProvider } from './components/context/TrackPlayerContext';
import TrackPlayerScreen from './screens/postLogin/TrackPlayerScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#121212',
    text: 'white',
    card: '#1E1E1E',
    border: '#272727',
  },
};

const PreLoginStackScreen = ({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) => (
  <Stack.Navigator>
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="Login" options={{ headerShown: false }}>
      {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={RegistrationScreen} />
    <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: {
        backgroundColor: '#1E1E1E',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      tabBarStyle: {
        backgroundColor: '#1E1E1E',
      },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#888',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Library') {
          iconName = focused ? 'library' : 'library-outline';
        }
        return <Icon name={iconName as string} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Library" component={LibraryScreen} />
  </Tab.Navigator>
);

const CustomDrawerContent = (props: any) => {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.upperDrawerItems}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.lowerDrawerItems}>
        <DrawerItem
          label="Logout"
          onPress={async () => {
            props.navigation.closeDrawer();
            await supabase.auth.signOut();
            props.setIsLoggedIn(false);
          }}
          icon={({ color, size }) => <Icon name="log-out-outline" size={size} color={color} />}
        />
      </View>
    </View>
  );
};

const MainNavigator = ({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} setIsLoggedIn={setIsLoggedIn} />}
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1E1E1E',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      drawerStyle: {
        backgroundColor: '#121212',
      },
      drawerActiveTintColor: 'white',
      drawerInactiveTintColor: '#888',
    }}
  >
    <Drawer.Screen name="Home Screen" component={TabNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Listening History" component={HistoryScreen} />
    <Drawer.Screen name="Settings and privacy" component={SettingsScreen} />
  </Drawer.Navigator>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <TrackPlayerProvider>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <NavigationContainer theme={DarkTheme}>
        <UserProvider>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1E1E1E',
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            {isLoggedIn ? (
              <>
                <Stack.Screen name="Main" options={{ headerShown: false }}>
                  {(props) => <MainNavigator {...props} setIsLoggedIn={setIsLoggedIn} />}
                </Stack.Screen>
                <Stack.Screen
                  name="PlaylistDetails"
                  component={PlaylistScreen as any}
                  options={{ title: 'Playlist Details' }}
                />
                <Stack.Screen
                  name="TrackPlayer"
                  component={TrackPlayerScreen as any}
                  options={{ title: 'Track Player' }}
                />
              </>
            ) : (
              <Stack.Screen name="PreLogin" options={{ headerShown: false }}>
                {(props) => <PreLoginStackScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </UserProvider>
      </NavigationContainer>
    </TrackPlayerProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewProfile: {
    color: '#888',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#4a4a4a',
  },
  upperDrawerItems: {
    flex: 1,
  },
  lowerDrawerItems: {
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#4a4a4a',
  },
});

AppRegistry.registerComponent('appName', () => App);