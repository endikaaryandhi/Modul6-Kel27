import { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Button, // Tetap digunakan untuk tombol "< Kembali"
  Alert,
  TouchableOpacity, // Ditambahkan
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useMqttSensor } from "../hooks/useMqttSensor.js";
import { Api, supabase } from "../services/api.js"; // Impor keduanya
import DataTable from "../components/DataTable.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '../context/AuthContext'; 

const PAGE_SIZE = 15;

export default function MonitoringScreen() {
  const { temperature, timestamp, connectionState, error: mqttError } = useMqttSensor();
  
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [page, setPage] = useState(1);
  const { session } = useAuth();
  const navigation = useNavigation();

  const fetchReadings = useCallback(async (currentPage) => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await Api.getSensorReadings(currentPage); 
      setReadings(data ?? []);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReadings(page);
      
      if (session) {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (_event === 'SIGNED_OUT') {
            Alert.alert('Sesi Berakhir', 'Anda telah logout.');
          }
        });
        return () => {
          subscription?.unsubscribe();
        };
      }
    }, [fetchReadings, page, session]) 
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setPage(1); 
      await fetchReadings(1); 
    } finally {
      setRefreshing(false);
    }
  }, [fetchReadings]);

  const handleGoBack = () => {
    if (!session) {
      navigation.navigate('Login');
    }
  };
  
  // --- KONDISI UNTUK TOMBOL ---
  const isPrevDisabled = page === 1 || loading;
  const isNextDisabled = readings.length < PAGE_SIZE || loading;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!session && (
          <View style={styles.guestHeader}>
            {/* Tombol ini boleh tetap standar */}
            <Button title="< Kembali ke Login" onPress={handleGoBack} />
            <Text style={styles.guestText}>Mode Tamu</Text>
          </View>
        )}
        
        <View style={styles.card}>
          <Text style={styles.title}>Realtime Temperature</Text>
          <View style={styles.valueRow}>
            <Text style={styles.temperatureText}>
              {typeof temperature === "number" ? `${temperature.toFixed(2)}°C` : "--"}
            </Text>
          </View>
          <Text style={styles.metaText}>MQTT status: {connectionState}</Text>
          {timestamp && (
            <Text style={styles.metaText}>
              Last update: {new Date(timestamp).toLocaleString()}
            </Text>
          )}
          {mqttError && <Text style={styles.errorText}>MQTT error: {mqttError}</Text>}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riwayat Data (Halaman {page})</Text>
          {loading && !refreshing && <ActivityIndicator />}
        </View>
        {apiError && <Text style={styles.errorText}>Gagal memuat riwayat: {apiError}</Text>}
        
        <DataTable
          columns={[
            {
              key: "recorded_at",
              title: "Timestamp",
              render: (value) => (value ? new Date(value).toLocaleString() : "--"),
            },
            {
              key: "temperature",
              title: "Temperature (°C)",
              render: (value) =>
                typeof value === "number" ? `${Number(value).toFixed(2)}` : "--",
            },
            {
              key: "threshold_value",
              title: "Threshold (°C)",
              render: (value) =>
                typeof value === "number" ? `${Number(value).toFixed(2)}` : "--",
            },
          ]}
          data={readings}
          keyExtractor={(item) => item.id}
        />

        {/* --- PERBAIKAN: Menggunakan TouchableOpacity --- */}
        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[styles.paginationButton, isPrevDisabled && styles.paginationButtonDisabled]}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={isPrevDisabled}
          >
            <Text style={styles.paginationButtonText}>Sebelumnya</Text>
          </TouchableOpacity>
          
          <Text style={styles.pageNumber}>Halaman {page}</Text>
          
          <TouchableOpacity
            style={[styles.paginationButton, isNextDisabled && styles.paginationButtonDisabled]}
            onPress={() => setPage((p) => p + 1)}
            disabled={isNextDisabled}
          >
            <Text style={styles.paginationButtonText}>Berikutnya</Text>
          </TouchableOpacity>
        </View>
        {/* ------------------------------------------- */}

      </ScrollView>
    </SafeAreaView>
  );
}

// Tambahkan style baru di bawah ini
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
    padding: 16,
  },
  guestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 10,
  },
  guestText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'gray',
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#ff7a59",
  },
  metaText: {
    marginTop: 8,
    color: "#555",
  },
  errorText: {
    marginTop: 8,
    color: "#c82333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20, 
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // --- STYLE BARU UNTUK TOMBOL PAGINATION ---
  paginationButton: {
    backgroundColor: 'blue', // Warna biru default
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
  },
  paginationButtonDisabled: {
    backgroundColor: 'gray', // Warna abu-abu saat disabled
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // ----------------------------------------
});