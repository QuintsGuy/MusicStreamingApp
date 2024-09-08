import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ConfirmationScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    // Redirect to HomeScreen after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Home');
        }, 5000);

        // Cleanup timer on unmount
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Registration Successful!</Text>
            <Text style={styles.subHeader}>
                You will be redirected to the home screen shortly.
            </Text>
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
});

export default ConfirmationScreen;
