import React, { useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Landing: undefined;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ConfirmationScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [countdown, setCountdown] = useState(3);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useLayoutEffect(() => {
        timerRef.current = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Landing' }],
                    });
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Registration Successful!</Text>
            <Text style={styles.subHeader}>
                You will be redirected to the home screen in {countdown} seconds.
            </Text>
            <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    spinner: {
        marginTop: 20,
    },
});

export default ConfirmationScreen;
