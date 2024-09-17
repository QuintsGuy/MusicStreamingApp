import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

type Track = {
    id: string;
    uri: string;
    title: string;
    artist: string;
    album: string;
}

type TrackPlayerContextType = {
    currentTrack: Track | null;
    isPlaying: boolean;
    play: (track: Track) => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    next: () => void;
    previous: () => void;
    stop: () => Promise<void>;
    seek: (position: number) => Promise<void>;
    currentPosition: number;
    trackDuration: number;
}

const TrackPlayerContext = createContext<TrackPlayerContextType | undefined>(undefined);
export const useTrackPlayer = () => useContext(TrackPlayerContext);

export const TrackPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currentPosition, setCurrentPosition] = useState(0);
    const trackDuration = 30;
    
    useEffect(() => {
        const updateCurrentPosition = async () => {
            if (sound) {
                const status = await sound.getStatusAsync();
                if (status.isLoaded && status.isPlaying) {
                    setCurrentPosition(status.positionMillis / 1000);
                }
            }
        };

        const interval = setInterval(updateCurrentPosition, 1000);

        return () => clearInterval(interval);
    }, [sound]);

    const playTrack = async (track: Track) => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: track.uri },
                { shouldPlay: true }
            );

            setSound(newSound);
            setCurrentTrack(track);
            setIsPlaying(true);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    setCurrentPosition(status.positionMillis / 1000);  // Update in seconds
                    if (status.didJustFinish) {
                        setIsPlaying(false);  // Pause when the track finishes
                    }
                }
            });

            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing track:', error);
            Alert.alert('Error playing track');
        }
    };

    const pauseTrack = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const resumeTrack = async () => {
        if (sound && !isPlaying) {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };
    
    const stopTrack = async () => {
        if (sound) {
            await sound.stopAsync();
            setIsPlaying(false);
        }
    };

    const seekTrack = async (position: number) => {
        if (sound) {
            await sound.setPositionAsync(position * 1000);
            setCurrentPosition(position);
        }
    }

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync();
        } : undefined;
    }, [sound]);

    return (
        <TrackPlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                play: playTrack,
                pause: pauseTrack,
                resume: resumeTrack,
                next: () => {},
                previous: () => {},
                stop: stopTrack,
                seek: seekTrack,
                currentPosition,
                trackDuration,
            }}
        >
            {children}
        </TrackPlayerContext.Provider>
    );
};