import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';
import { Track } from '../types/spotify';

type TrackPlayerContextType = {
    currentTrack: Track | null;
    setCurrentTrack: (track: Track | null) => void;
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
    toggleMinimize: (value: boolean) => void;
    isMinimized: boolean;
}

const TrackPlayerContext = createContext<TrackPlayerContextType | undefined>(undefined);
export const useTrackPlayer = () => useContext(TrackPlayerContext);

export const TrackPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
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
            setIsMinimized(true);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    setCurrentPosition(status.positionMillis / 1000);
                    if (status.didJustFinish) {
                        setIsPlaying(false);
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
            setIsMinimized(false);
        }
    };

    const seekTrack = async (position: number) => {
        if (sound) {
            await sound.setPositionAsync(position * 1000);
            setCurrentPosition(position);
        }
    }

    const toggleMinimize = () => {
        setIsMinimized((prev) => !prev);
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
                setCurrentTrack,
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
                isMinimized,
                toggleMinimize,
            }}
        >
            {children}
        </TrackPlayerContext.Provider>
    );
};