import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useUser } from '../../components/context/UserContext';

type RootStackParamList = {
  Home: undefined;
  Details: { item: any; type: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type SpotifyItem = {
  id: string;
  name: string;
  images: { url: string }[];
};
5
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';
const ACCESS_TOKEN = 'f7ceba9f68f843e2bb9022254e41773d';

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const { user } = useUser();

  const [playlists, setPlaylists] = useState([]);
  const [hotArtists, setHotArtists] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    // Fetch playlists, hot artists, and podcasts from Spotify API
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const playlistsResponse = await fetch(`${SPOTIFY_API_URL}browse/featured-playlists`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      const playlistsData = await playlistsResponse.json();
      setPlaylists(playlistsData.playlists.items);

      const artistsResponse = await fetch(`${SPOTIFY_API_URL}browse/new-releases`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      const artistsData = await artistsResponse.json();
      setHotArtists(artistsData.albums.items);

      const podcastsResponse = await fetch(`${SPOTIFY_API_URL}browse/categories/podcasts`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      const podcastsData = await podcastsResponse.json();
      setPodcasts(podcastsData.categories.items);

    } catch (error) {
      console.error('Error fetching Spotify data:', error);
    }
  };

  const renderItem = ({ item, type }: { item: any; type: string }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { item, type })}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.images[0].url }} style={styles.itemImage} />
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.display_name}!</Text>
      
      <Text style={styles.title}>Featured Playlists</Text>
      <FlatList
        horizontal
        data={playlists}
        renderItem={({ item }) => renderItem({ item, type: 'playlist' })}
        keyExtractor={(item: SpotifyItem) => item.id}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.title}>Hot Artists</Text>
      <FlatList
        horizontal
        data={hotArtists}
        renderItem={({ item }) => renderItem({ item, type: 'artist' })}
        keyExtractor={(item: SpotifyItem) => item.id}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.title}>Featured Podcasts</Text>
      <FlatList
        horizontal
        data={podcasts}
        renderItem={({ item }) => renderItem({ item, type: 'podcast' })}
        keyExtractor={(item: SpotifyItem) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Spotify-like background color
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginRight: 16,
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  itemText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
