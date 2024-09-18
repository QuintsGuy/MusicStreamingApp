import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAlbumTracks, getArtistTracks, getPlaylistTracks, getShowEpisodes } from '../../services/spotifyAPI';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrackPlayer } from '../../context/TrackPlayerContext';

export type RootStackParamList = {
    Main: undefined;
    PlaylistDetails: { 
        id: string; 
        type: string; 
        title: string; 
        imageUrl: string; 
        subtitle: string 
    };
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

type PlaylistScreenProps = NativeStackScreenProps<RootStackParamList, 'PlaylistDetails'>;

const PlaylistScreen: React.FC<PlaylistScreenProps> = ({ route, navigation }) => {
    const { id, type, title, imageUrl, subtitle } = route.params;
    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { play } = useTrackPlayer() ?? {};

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        let data;
        try {
            switch (type) {
                case 'playlist':
                    data = await getPlaylistTracks(id);
                    break;
                case 'album':
                    data = await getAlbumTracks(id);
                    break;
                case 'artist':
                    data = await getArtistTracks(id);
                    break;
                case 'show':
                    data = await getShowEpisodes(id);
                    break;
                default:
                    console.error('Unknown type:', type);
                    return null;
            }
            console.log('Fetched data:', data);
            setTracks(data);
        } catch (error) {
            console.error('Error fetching tracks:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        if (!item) return null;
        const isEpisode = type === 'show' && item.audio_preview_url;
    
        return (
            <TouchableOpacity onPress={() => { 
                const track = isEpisode
                    ? { id: item.id, uri: item.audio_preview_url, title: item.name, artist: item.show?.publisher, album: imageUrl }
                    : { id: item.track?.id, uri: item.track?.preview_url, title: item.track?.name, artist: item.track?.artists[0]?.name, album: item.track?.album.images[0]?.url };
    
                if (!track.uri) {
                    console.error('No audio available. Select another track.');
                } else {
                    navigation.navigate('TrackPlayer', { track });
                }
            }}>
                <View style={styles.trackContainer}>
                    {item.track?.album?.images?.[0]?.url || item.images?.[0]?.url ? (
                        <Image source={{ uri: item.track?.album?.images?.[0]?.url || item.images?.[0]?.url }} style={styles.albumImage} />
                    ) : (
                        <View style={styles.placeholderAlbumImage} />
                    )}
                    <View style={styles.trackInfo}>
                        <Text style={styles.trackName}>{item.track?.name || item.name}</Text>
                        <Text style={styles.artistName}>{item.track?.artists?.[0]?.name || item.show?.publisher}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#fff" />;
    }
    
    return (
        <View style={styles.container}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.playlistImage} />
            ) : (
                <View style={styles.placeholderAlbumImage} />
            )}
            <Text style={styles.playlistName}>{title}</Text>
            <Text style={styles.playlistOwner}>{subtitle}</Text>

            <FlatList
                data={tracks}
                renderItem={renderItem}
                keyExtractor={(item) => item?.track?.id || Math.random().toString()}
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