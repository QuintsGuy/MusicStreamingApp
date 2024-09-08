import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase';// Make sure your Supabase client is properly set up
import * as EmailValidator from 'email-validator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Confirmation: undefined;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Client-side validation
    const validateForm = () => {
        if (!EmailValidator.validate(email)) {
            Alert.alert('Invalid email', 'Please enter a valid email address.');
            return false;
        }

        if (password.length < 6) {
        Alert.alert('Invalid password', 'Password should be at least 6 characters long.');
        return false;
        }

        return true;
    };

  // Handle login form submission
    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        setLoading(false);

        if (error) {
            Alert.alert('Login error', error.message);
        } else {
            // Navigate to HomeScreen upon successful login
            navigation.navigate('Confirmation');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Password Field */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
            />

            {/* Login Button */}
            <Button
                title={loading ? 'Logging in...' : 'Login'}
                onPress={handleLogin}
                color="#1DB954" // Spotify green for button styling
                disabled={loading}
            />
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
});

export default LoginScreen;
