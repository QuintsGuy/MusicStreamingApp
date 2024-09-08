import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import SearchScreen from './SearchScreen';
import LibraryScreen from './LibraryScreen';
import AlbumDetails from './AlbumsDetails';
import PlaylistScreen from './PlaylistScreen';

const SearchStack = createNativeStackNavigator();
const LibraryStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SearchStackScreen = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="AlbumDetails" component={AlbumDetails} />
    </SearchStack.Navigator>
  );
};

const LibraryStackScreen = () => {
  return (
    <LibraryStack.Navigator>
      <LibraryStack.Screen name="Library" component={LibraryScreen} />
      <LibraryStack.Screen name="Playlist" component={PlaylistScreen} />
    </LibraryStack.Navigator>
  );
}

const HomeScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarLabelStyle: { fontSize: 15 },
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Library') {
            iconName = 'library';
          }
          return <Icon name={iconName} color={color} size={size} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Library" component={LibraryStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
