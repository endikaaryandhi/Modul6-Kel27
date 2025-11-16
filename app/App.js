import 'react-native-gesture-handler'; // HARUS di paling atas
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Konteks Auth
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
// Pastikan Anda mengimpor file yang sudah dikoreksi (dengan export default)
import MonitoringScreen from './src/screens/MonitoringScreen';
import ControlScreen from './src/screens/ControlScreen';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
// --- SCREEN BARU DITAMBAHKAN ---
import RegistrationScreen from './src/screens/RegistrationScreen';
// ------------------------------

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

// Navigasi untuk pengguna yang SUDAH LOGIN
function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Monitoring"
      tabBarPosition="bottom"
      swipeEnabled={true}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Monitoring') {
            iconName = focused ? 'desktop' : 'desktop-outline';
          } else if (route.name === 'Control') {
            iconName = focused ? 'options' : 'options-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarShowIcon: true,
        tabBarLabelStyle: { fontSize: 10, marginTop: 0 },
        tabBarIndicatorStyle: { backgroundColor: 'blue', height: 2 },
      })}
    >
      <Tab.Screen name="Monitoring" component={MonitoringScreen} />
      <Tab.Screen name="Control" component={ControlScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navigasi untuk TAMU (BELUM LOGIN)
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* --- SCREEN BARU DITAMBAHKAN --- */}
      <Stack.Screen name="Register" component={RegistrationScreen} />
      {/* ------------------------------ */}
      <Stack.Screen name="GuestMonitoring" component={MonitoringScreen} />
    </Stack.Navigator>
  );
}

// Navigator Utama
function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {session && session.user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

// Komponen App utama
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}