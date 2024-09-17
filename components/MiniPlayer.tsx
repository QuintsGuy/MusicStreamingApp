import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTrackPlayer } from './context/TrackPlayerContext';
import Icon from 'react-native-vector-icons/Ionicons';

const MiniPlayer: React.FC<{ onExpand: () => void }> = ({ onExpand }) => {
    const trackPlayerContext = useTrackPlayer();
    
    if (!trackPlayerContext) {
        return <Text>No track player context</Text>;
    }
    
    const { currentTrack, isPlaying, play, pause } = trackPlayerContext;

    return (
        <TouchableOpacity style={styles.container} onPress={onExpand}>
            <Image source={{ uri: currentTrack?.album }} style={styles.albumArt} />
            <View style={styles.info}>
                <Text style={styles.trackName}>{currentTrack?.title}</Text>
                <Text style={styles.artistName}>{currentTrack?.artist}</Text>
            </View>
            <View style={styles.controls}>
                {isPlaying ? (
                    <TouchableOpacity onPress={pause}>
                        <Icon name="pause" size={30} color="#fff" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => play(currentTrack as any)}>
                        <Icon name="play" size={30} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
    },
    albumArt: {
        width: 50,
        height: 50,
        borderRadius: 4,
    },
    info: {
        flex: 1,
        marginLeft: 10,
    },
    trackName: {
        fontSize: 16,
        color: '#fff',
    },
    artistName: {
        fontSize: 14,
        color: '#888',
    },
    controls: {
        marginRight: 10,
    },
});

export default MiniPlayer;
