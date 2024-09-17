import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from '../../components/context/UserContext';
import { getFeaturedPlaylists, getFeaturedPodcasts, getNewReleases } from '../../services/spotifyAPI';

type RootStackParamList = {
  Home: undefined;
  PlaylistDetails: { item: any; type: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type SpotifyItem = {
  id: string;
  name: string;
  images: { url: string }[];
};

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const { user } = useUser();

  const [playlists, setPlaylists] = useState<SpotifyItem[]>([]);
  const [newReleases, setNewReleases] = useState<SpotifyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch playlists, hot artists, and podcasts from Spotify API
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);

      const playlistData = await getFeaturedPlaylists();
      setPlaylists(playlistData || []);  // Ensure playlistData is valid

      const newReleasesData = await getNewReleases();
      setNewReleases(newReleasesData || []);   // Ensure artistData is valid

    } catch (error) {
      console.error('Error fetching Spotify data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, type }: { item: SpotifyItem; type: string }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PlaylistDetails', { item, type })}>
      <View style={styles.itemContainer}>
        {item.images?.[0]?.url ? (
          <Image source={{ uri: item.images[0].url }} style={styles.itemImage} />
        ) : (
          <Text style={styles.itemText}>No Image</Text>
        )}
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.display_name}!</Text>

      <Text style={styles.title}>Featured Playlists</Text>
      <FlatList
        horizontal
        data={playlists}
        renderItem={({ item }) => renderItem({ item, type: 'playlist' })}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No Playlists Available</Text>}
      />

      <Text style={styles.title}>New Releases</Text>
      <FlatList
        horizontal
        data={newReleases}
        renderItem={({ item }) => renderItem({ item, type: 'album' })}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No New Releases Available</Text>}
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
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;