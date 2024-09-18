import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import supabase from '../../services/supabase';
import * as EmailValidator from 'email-validator';
import { useUser } from '../../context/UserContext';

interface LoginScreenProps {
    setIsLoggedIn: (value: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setIsLoggedIn }) => {
    const { fetchUserSession } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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

    const resendVerificationEmail = async (email: string) => {
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'music-streaming-app://login',
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Verification email resent successfully');
        }
    }

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        setLoading(false);

        if (error) {
            if (error.message.includes('Email not confirmed')) {
                // Show alert with option to resend verification email
                Alert.alert(
                    'Email not confirmed',
                    'Your email has not been confirmed. Would you like to resend the confirmation email?',
                    [
                        { text: 'Cancel', style: 'cancel', },
                        { text: 'Resend Email', onPress: () => resendVerificationEmail(email) },
                    ],
                );
            } else {
                Alert.alert('Login error', error.message);
            }
        } else {
            setEmail('');
            setPassword('');
            try {
                await fetchUserSession();
                setIsLoggedIn(true);
            } catch (error) {
                Alert.alert('Failed to fetch user session data.');
            }
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

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
            />

            <Button
                title={loading ? 'Logging in...' : 'Login'}
                onPress={handleLogin}
                color="#1DB954"
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
