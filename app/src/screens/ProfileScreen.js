import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // AuthProvider akan mendeteksi perubahan sesi dan App.js akan navigasi
    } catch (error) {
      Alert.alert('Logout Gagal', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Pengguna</Text>
      {user ? (
        <Text style={styles.email}>Email: {user.email}</Text>
      ) : (
        <Text style={styles.email}>Gagal memuat profil.</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} color="red" />
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '60%',
  },
});

export default ProfileScreen;