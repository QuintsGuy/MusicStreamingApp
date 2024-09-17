import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getPlaylistTracks } from '../../services/spotifyAPI';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrackPlayer } from '../../components/context/TrackPlayerContext';

export type RootStackParamList = {
    Main: undefined;
    PlaylistDetails: { item: any; type: string };
    TrackPlayer: { 
        track: { 
            id: string; 
            uri: string; 
            title: string; 
            artist: string; 
            album: string;
        }; 
    };
    PreLogin: undefined;
};

type PlaylistScreenProps = NativeStackScreenProps<RootStackParamList, 'PlaylistDetails', 'TrackPlayer'>;

const PlaylistScreen: React.FC<PlaylistScreenProps> = ({ route, navigation }) => {
    const { item } = route.params;
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { play } = useTrackPlayer() ?? {};

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        const data = await getPlaylistTracks(item.id);
        setTracks(data);
        setLoading(false);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => { 
            if (!item.track.preview_url) {
                console.error('No audio available. Select another track.');
            } else {
                navigation.navigate('TrackPlayer', {
                    track: {
                        id: item.track.id,
                        uri: item.track.preview_url, 
                        title: item.track.name,
                        artist: item.track.artists[0].name,
                        album: item.track.album.images[0]?.url
                    }
                });
            }
        }}>
            <View style={styles.trackContainer}>
                {item.track.album?.images?.[0]?.url ? (
                    <Image source={{ uri: item.track.album.images[0].url }} style={styles.albumImage} />
                ) : (
                    <View style={styles.placeholderAlbumImage} />
                )}
                <View style={styles.trackInfo}>
                    <Text style={styles.trackName}>{item.track.name}</Text>
                    <Text style={styles.artistName}>{item.track.artists[0].name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
    
    if (loading) {
        return <ActivityIndicator size="large" color="#fff" />;
    }
    
    return (
        <View style={styles.container}>
            <Image source={{ uri: item.images[0]?.url }} style={styles.playlistImage} />
            <Text style={styles.playlistName}>{item.name}</Text>
            <Text style={styles.playlistOwner}>By {item.owner.display_name}</Text>
        
            <FlatList
                data={tracks}
                renderItem={renderItem}
                keyExtractor={(item) => item.track.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    playlistImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    playlistName: {
        fontSize: 24,
        color: '#fff',
        marginTop: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    playlistOwner: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 16,
    },
    trackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    albumImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 12,
        marginLeft: 12,
    },
    placeholderAlbumImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        backgroundColor: '#888',
        marginRight: 12,
    },
    trackInfo: {
        flex: 1,
    },
    trackName: {
        fontSize: 18,
        color: '#fff',
    },
    artistName: {
        fontSize: 14,
        color: '#888',
    },
    separator: {
        height: 1,
        backgroundColor: '#303030',
    },
});

export default PlaylistScreen;