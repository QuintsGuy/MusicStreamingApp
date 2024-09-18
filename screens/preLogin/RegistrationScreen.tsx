import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import supabase from '../../services/supabase'; // Assume you have supabase client setup
import * as EmailValidator from 'email-validator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Confirmation: undefined;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RegistrationScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Client-side validation
  const validateForm = () => {
    if (!username) {
      Alert.alert('Username is required', 'Please enter a username.');
      return false;
    }

    if (!EmailValidator.validate(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return false;
    }

    if (!phone) {
      Alert.alert('Phone number is required', 'Please enter a phone number.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password should be at least 6 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please ensure both passwords are identical.');
      return false;
    }
    return true;
  };

  // Submit form to Supabase
  const handleRegister = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
  
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password, 
      phone: phone,
      options: {
        data: {
          display_name: username,
        },
      },
    });
  
    setLoading(false);
  
    if (error) {
      if (error.message.includes('email rate limit exceeded')) {
        Alert.alert('Too many attempts.', 'Please try again later or use a different email.');
      } else {
        Alert.alert('Registration error', error.message);
      }
    } else {
      // Navigate to confirmation screen
      navigation.navigate('Confirmation');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

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
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <Button
        title={loading ? 'Registering...' : 'Register'}
        onPress={handleRegister}
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

export default RegistrationScreen;
