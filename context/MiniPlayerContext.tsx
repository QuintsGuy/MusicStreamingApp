import { createContext, useContext, useState } from "react";
import { Track } from "../types/spotify";
import { Audio } from "expo-av";

type MiniPlayerContextType = {
    currentTrack: Track | null;
    isPlaying: boolean;
    isMinimized: boolean;
    play: (track: Track) => void;
    pause: () => void;
    resume: () => void;
    toggleMinimize: () => void;
    showMiniPlayer: () => void;
    hideMiniPlayer: () => void;
};

const MiniPlayerContext = createContext<MiniPlayerContextType | undefined>(undefined);

export const useMiniPlayer = () => {
    return useContext(MiniPlayerContext);
};

export const MiniPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const play = async (track: Track) => {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: track.uri });
        setSound(newSound);
        setCurrentTrack(track);
        setIsPlaying(true);
        setIsMinimized(true);
        await newSound.playAsync();
    };

    const pause = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const resume = async () => {
        if (sound && !isPlaying) {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const showMiniPlayer = () => {
        setIsMinimized(true);
    };

    const hideMiniPlayer = () => {
        setIsMinimized(false);
    };

    return (
        <MiniPlayerContext.Provider
            value={{ currentTrack, isPlaying, isMinimized, play, pause, resume, toggleMinimize, showMiniPlayer, hideMiniPlayer }}
        >
            {children}
        </MiniPlayerContext.Provider>
    );
};