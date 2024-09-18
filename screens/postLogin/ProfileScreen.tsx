import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Keyboard } from 'react-native';
import supabase from '../../services/supabase';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../context/UserContext';

type Profile = {
    avatar: string | null;
    displayName: string | null;
    email: string | null;
    bio: string | null;
    phone: string | null;
};

const ProfileScreen = () => {
    const { user, fetchUserSession } = useUser();
    const [editField, setEditField] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile>({
        avatar: user?.avatar_url || null,
        displayName: user?.display_name || null,
        email: user?.email || null,
        bio: user?.bio || null,
        phone: user?.phone || null,
    });

    const handleSaveChanges = async () => {
        try {
            await updateProfile({
                displayName: profile.displayName,
                email: profile.email,
                bio: profile.bio,
                phone: profile.phone,
                avatar: profile.avatar,
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save changes.');
        }
    };

    const handleEditField = (field: string) => {
        if (editField === field) return;
        setEditField(field);
    };

    const handleFocusOut = (field: string) => {
        Keyboard.dismiss();
        Alert.alert(
            'Confirm Changes',
            'Would you like to save the changes?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        setEditField(null);
                    },
                    style: 'cancel',
                },
                {
                    text: 'Save',
                    onPress: () => {
                        handleSaveChanges();
                        setEditField(null);
                    },
                },
            ]
        );
    };

    const renderProfileField = (field: keyof Profile, placeholder: string, isMultiline = false) => (
        <View style={styles.profileItem}>
            {editField === field ? (
                <TextInput
                    style={[styles.input, isMultiline ? styles.bioInput : null]}
                    value={profile[field] || ''}
                    onChangeText={(text) => setProfile({ ...profile, [field]: text })}
                    onBlur={() => setEditField(null)}
                    autoFocus
                    multiline={isMultiline}
                />
            ) : (
                <View style={styles.textRow}>
                    <Text style={styles.textLabel}>{profile[field] || placeholder}</Text>
                    <TouchableOpacity onPress={() => setEditField(field)}>
                        <Icon name="pencil" size={20} color="#1DB954" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    const handleImageUpload = async () => {
        try {
            const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                
                if (newStatus !== 'granted') {
                    Alert.alert('Permission Denied', 'We need camera roll permissions to upload a profile picture.');
                    return;
                }
            }

            // Now, launch the image picker
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
        
            if (result.canceled) {
                return;
            }
        
            const file = result.assets[0];
            await uploadImage(file.uri);

        } catch (error) {
            console.error('Error accessing camera roll: ', error);
            Alert.alert('Error', 'Failed to access the camera roll.');
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const fileExt = uri.split('.').pop();
            const fileName = `${user?.id}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, blob, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL for the uploaded avatar
            const { data: { publicUrl } } = await supabase
                .storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update user profile with the new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user?.id);

            if (updateError) throw updateError;

            // Refresh user session to update the avatar in the profile
            await fetchUserSession();  // Refresh session after update
            setProfile({ ...profile, avatar: publicUrl });  // Update local state
            Alert.alert('Success', 'Profile picture updated successfully!');
        } catch (error) {
            console.error('Upload image error:', error);
            Alert.alert('Error', 'Failed to upload image.');
        }
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user?.id);

            if (error) throw error;

            // Refresh user session after profile update
            await fetchUserSession();
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile.');
        }
    };

    const handleChangePassword = () => {
        // Implement password change logic here
        Alert.alert('Change Password', 'Password change functionality not implemented yet.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
                {profile.avatar ? (
                    <Image source={{ uri: profile.avatar }} style={styles.profileImage} />
                ) : (
                    <View style={[styles.profileImage, styles.defaultAvatar]}>
                        <Icon name="person" size={50} color="#ffffff" />
                    </View>
                )}
                <Text style={styles.uploadText}>Upload Profile Picture</Text>
            </TouchableOpacity>

            {renderProfileField('displayName', 'Display Name')}
            {renderProfileField('email', 'Email')}
            {renderProfileField('bio', 'Bio', true)}
            {renderProfileField('phone', 'Phone Number')}

            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text>Change Password</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    imageUpload: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    uploadText: {
        color: '#1DB954',
    },
    profileItem: {
        width: '100%',
        marginBottom: 15,
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    textLabel: {
        fontSize: 18,
        color: 'white',
    },
    input: {
        color: 'white',
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
    },
    bioInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#1DB954',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    defaultAvatar: {
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;