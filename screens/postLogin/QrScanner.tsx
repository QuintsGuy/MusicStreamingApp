import React, { useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type QRScannerScreenProps = {
    route: RouteProp<{ params: { onScan: (data: string) => void } }, 'params'>;
    navigation: NativeStackNavigationProp<any>;
};

const QRScannerScreen = ({ route, navigation }: QRScannerScreenProps) => {
    const { onScan } = route.params;

    useEffect(() => {
        const requestPermission = async () => {
            await BarCodeScanner.requestPermissionsAsync();
        };
        requestPermission();
    }, []);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        onScan(data); 
        navigation.goBack(); 
    };

    return (
        <View style={{ flex: 1 }}>
            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={{ flex: 1 }}
            />
            <Text style={{ position: 'absolute', bottom: 50, alignSelf: 'center', color: '#fff' }}>
                Scan a QR code to fetch track details
            </Text>
        </View>
    );
};

export default QRScannerScreen;
