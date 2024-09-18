import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTrackPlayer } from '../../context/TrackPlayerContext';
import { fetchSpotifySearch } from '../../services/spotifyAPI'; // Add your Spotify API service
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Track } from '../../types/spotify';

type RootStackParamList = {
    TrackPlayer: { track: any };
    QRScannerScreen: { onScan: (qrCode: string) => void };
    PlaylistDetails: { id: string; title: string; imageUrl: string; subtitle: string; type: string };
};

type SearchScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const SearchScreen = ({ navigation }: SearchScreenProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Track[]>([]);
    const { play } = useTrackPlayer() ?? {};

    const handleQRScan = (qrCode: string) => {
        fetchSpotifySearch(qrCode)
            .then((results) => {
                if (results.length > 0) {
                    const track: Track = {
                        id: results[0].id,
                        uri: results[0].preview_url,
                        title: results[0].name,
                        artist: results[0].artists[0].name,
                        album: results[0].album.images[0].url,
                    };
                    play?.(track);
                    navigation.navigate('TrackPlayer', { track });
                }
            })
            .catch((error) => console.error(error));
    };

    const searchSpotify = async (query: string) => {
        if (query.length === 0) return;
        const results = await fetchSpotifySearch(query);
        setResults(results);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        searchSpotify(query);
    };

    const renderItem = ({ item }: { item: any }) => {
        if (!item) return null;
        let title: string = '', subtitle: string = '', imageUrl: string = '', previewUrl: string = '', id: string = '';
    
        switch (item?.type) {
            case 'track':
                title = item?.name ?? 'Unknown Track';
                subtitle = item?.artists?.[0]?.name ?? 'Unknown Artist';
                imageUrl = item?.album?.images?.[0]?.url ?? '';
                previewUrl = item?.preview_url ?? '';
                id = item?.id ?? '';
                break;
            case 'episode':
                title = item?.name ?? 'Unknown Episode';
                subtitle = item?.show?.name ?? 'Unknown Show';
                imageUrl = item?.images?.[0]?.url ?? '';
                previewUrl = item?.audio_preview_url ?? '';
                id = item?.id ?? '';
                break;
            case 'album':
            case 'artist':
            case 'playlist':
            case 'show':
                title = item?.name ?? `Unknown ${item?.type}`;
                subtitle = item?.type === 'playlist'
                    ? `Playlist • ${item?.owner?.display_name ?? 'Unknown Owner'}`
                    : item?.artists?.[0]?.name ?? item?.type;
                imageUrl = item?.images?.[0]?.url ?? '';
                id = item?.id ?? '';
                break;
            default:
                return null;
        }
    
        return (
            <TouchableOpacity onPress={() => {
                if (item.type === 'track' || item.type === 'episode') {
                    if (!previewUrl) {
                        console.error('No audio available. Select another track.');
                    } else {
                        navigation.navigate('TrackPlayer', {
                            track: { id, uri: previewUrl, title, artist: subtitle, album: imageUrl }
                        });
                    }
                } else {
                    navigation.navigate('PlaylistDetails', {
                        id,
                        title,
                        imageUrl, 
                        subtitle,
                        type: item.type
                    });
                }
            }}>
                <View style={styles.itemContainer}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.itemImage} />
                    ) : (
                        <View style={styles.placeholderImage} />
                    )}
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{title}</Text>
                        <Text style={styles.itemSubtitle}>{subtitle}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header with QR icon */}
            <View style={styles.header}>
                <Text style={styles.title}>Search</Text>
                <TouchableOpacity onPress={() => navigation.navigate('QRScannerScreen', { onScan: handleQRScan })}>
                    <Icon name="camera-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search for tracks, albums, artists..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearchChange}
            />

            {/* Search Results */}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchInput: {
        backgroundColor: '#1E1E1E',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#303030',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 10,
    },
    placeholderImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        backgroundColor: '#303030',
        marginRight: 10,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#b3b3b3',
    },
});

export default SearchScreen;
