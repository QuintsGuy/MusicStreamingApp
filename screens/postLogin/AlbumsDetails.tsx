import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

const AlbumDetails = () => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // async function playSound() {
    //     const { sound } = await Audio.Sound.createAsync(
    //         require('../assets/sounds/album.mp3')
    //     );
    //     setSound(sound);
    //     await sound.playAsync();
    // }

    return (
        <View>
            {/* <Image
                source={require('../assets/images/album.jpg')}
            /> */}
            <Text>Album Title</Text>
            <Text>Artist Name</Text>
            {/* <Button title="Play" onPress={playSound} /> */}
        </View>
    );
};

export default AlbumDetails;