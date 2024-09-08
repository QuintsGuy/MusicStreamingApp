import { Text, View, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LandingScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome to Music Streaming App</Text>
            <Text style={styles.subHeader}>Please log in or register to continue</Text>
            <Button
                title="Login"
                onPress={() => navigation.navigate('Login')}
                color="#1DB954"
            />

            <View style={styles.buttonSpacing}>
                <Button
                title="Register"
                onPress={() => navigation.navigate('Register')}
                color="#1DB954"
                />
            </View>
        </View>
    );
};
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5', // Light background
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonSpacing: {
        marginTop: 15,
    },
});

export default LandingScreen;