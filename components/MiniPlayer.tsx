import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTrackPlayer } from '../context/TrackPlayerContext';
import { useNavigation } from '@react-navigation/native';
import { Track } from '../types/spotify';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
    TrackPlayer: { track: Track };
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

type MiniPlayerProps = {
    navigation?: NavigationProp<RootStackParamList>;
};

const MiniPlayer: React.FC<MiniPlayerProps> = ({ navigation }) => {
    const { currentTrack, isPlaying, play, pause, resume, isMinimized, toggleMinimize } = useTrackPlayer() ?? {};
    const navigationProp = navigation ?? useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    if (!currentTrack || !isMinimized) return null;

    const handleExpand = () => {
        toggleMinimize?.(false);
        navigationProp.navigate('TrackPlayer', { track: currentTrack });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handleExpand}>
        <Image source={{ uri: currentTrack.album }} style={styles.albumArt} />
        <View style={styles.info}>
            <Text style={styles.trackName}>{currentTrack.title}</Text>
            <Text style={styles.artistName}>{currentTrack.artist}</Text>
        </View>
        <View style={styles.controls}>
            <TouchableOpacity onPress={isPlaying ? pause : () => play?.(currentTrack)}>
                <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#fff" />
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',  // Darker background color
        padding: 10,
        position: 'absolute',
        bottom: 60, // Ensure MiniPlayer sits above the bottom tab bar
        left: 15,  // Add margin around the container
        right: 15, // Add margin around the container
        height: 70,
        borderRadius: 10,  // Rounded corners for the container
        zIndex: 1000,
        borderWidth: 2,  // Transparent border to simulate a shadow effect on Android
        borderColor: 'rgba(29, 185, 84, 0.5)',
    },
    albumArt: {
        width: 50,
        height: 50,
        borderRadius: 4,
    },
    info: {
        flex: 1,
        marginLeft: 15,
    },
    trackName: {
        fontSize: 14,
        color: '#fff',
    },
    artistName: {
        fontSize: 12,
        color: '#888',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 80,
    }
});

export default MiniPlayer;
