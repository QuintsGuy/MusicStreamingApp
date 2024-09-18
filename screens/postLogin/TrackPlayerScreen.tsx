import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTrackPlayer } from '../../context/TrackPlayerContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Track } from '../../types/spotify';

type RootStackParamList = {
    TrackPlayerScreen: { track: Track };  // Specify the track is part of the params
};

type TrackPlayerScreenRouteProp = RouteProp<RootStackParamList, 'TrackPlayerScreen'>;

const TrackPlayerScreen = () => {
    const trackPlayerContext = useTrackPlayer();
    const route = useRoute<TrackPlayerScreenRouteProp>();
    const { track } = route.params;

    if (!trackPlayerContext) {
        return <Text>No track player context</Text>;
    }

    const { 
        currentTrack, 
        setCurrentTrack,
        isPlaying, 
        play, 
        pause, 
        resume,
        next, 
        previous, 
        seek, 
        currentPosition, 
        trackDuration,
        toggleMinimize,
        isMinimized
    } = trackPlayerContext;

    const [seeking, setSeeking] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    useEffect(() => {
        if (track && (!currentTrack || currentTrack.id !== track.id)) {
            play(track);
            setCurrentTrack(track);
        }
    }, [track]);

    useEffect(() => {        
        const interval = setInterval(async () => {
            if (!seeking && isPlaying) {
                const position = currentPosition + 1;
                setSliderValue(position);
                if (position >= trackDuration) {
                    pause();
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentPosition, trackDuration, isPlaying, seeking]);

    useEffect(() => {
        if (!seeking && isPlaying) {
            setSliderValue(currentPosition);
        }
    }, [currentPosition, seeking, isPlaying]);

    const handleSeek = async (value: number) => {
        setSeeking(true);
        await seek(value);
        resume();
        setSeeking(false);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    };

    const handleSlidingStart = () => {
        setSeeking(true);
    }

    useFocusEffect(
        useCallback(() => {
            return () => {
                if (!isMinimized) {
                    toggleMinimize(true);
                }
            };
        }, [toggleMinimize, isMinimized])
    );

    return (
        <View style={styles.container}>
            <Image source={{ uri: currentTrack?.album }} style={styles.albumArt} />
            <Text style={styles.trackName}>{currentTrack?.title}</Text>
            <Text style={styles.artistName}>{currentTrack?.artist}</Text>

            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={trackDuration}
                value={sliderValue}
                onValueChange={setSliderValue}
                onSlidingComplete={handleSeek}
                onSlidingStart={handleSlidingStart}
                minimumTrackTintColor='#1DB954'
                thumbTintColor='#1DB954'
                maximumTrackTintColor='#B3B3B3'
            />
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(sliderValue)}</Text>
                <Text style={styles.timeText}>{formatTime(trackDuration)}</Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={previous}>
                    <Icon name="play-skip-back" size={40} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlayPause}>
                    {isPlaying ? (
                        <Icon name="pause" size={40} color="#fff" />
                    ) : (
                        <Icon name="play" size={40} color="#fff" />
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={next}>
                    <Icon name="play-skip-forward" size={40} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
    },
    albumArt: {
        width: 300,
        height: 300,
        borderRadius: 8,
        marginBottom: 20,
    },
    trackName: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 8,
    },
    artistName: {
        fontSize: 18,
        color: '#888',
        marginBottom: 20,
    },
    slider: {
        width: '80%',
        height: 40,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 20,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    minimizeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 10,
    },
    timeText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default TrackPlayerScreen;
