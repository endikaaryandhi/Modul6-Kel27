import { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Api } from "../services/api.js";
import DataTable from "../components/DataTable.js"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '../context/AuthContext';

export default function ControlScreen() {
  // State untuk form (data cepat)
  const [thresholdValue, setThresholdValue] = useState(30);
  const [note, setNote] = useState("");
  const [currentThreshold, setCurrentThreshold] = useState(null); 
  
  // State untuk riwayat (data lambat)
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false); 

  // State untuk UI
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { session } = useAuth();

  // FUNGSI 1: Hanya mengambil nilai terbaru (CEPAT)
  const fetchLatest = useCallback(async () => {
    if (!session?.access_token) {
      setError("Sesi tidak valid.");
      return;
    }
    setError(null);
    try {
      const data = await Api.getLatestThreshold(session.access_token);
      if (data && data.value) {
        setCurrentThreshold(data.value);
        // Set form input ke nilai yang ada
        setThresholdValue(String(data.value)); 
        setNote(data.note || "");
      }
    } catch (err) {
      setError(err.message);
    }
  }, [session]);

  // FUNGSI 2: Mengambil semua riwayat (LAMBAT)
  const fetchHistory = useCallback(async () => {
    if (!session?.access_token) {
      setError("Sesi tidak valid.");
      setLoadingHistory(false);
      return;
    }
    setLoadingHistory(true);
    setError(null);
    try {
      const data = await Api.getThresholds(session.access_token);
      setHistory(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      // Panggil keduanya saat layar fokus
      fetchLatest();
      fetchHistory();
    }, [fetchLatest, fetchHistory])
  );

  const handleSubmit = useCallback(async () => {
    if (!session?.access_token) {
      setError("Sesi tidak valid.");
      return;
    }

    const valueNumber = Number(thresholdValue);
    if (Number.isNaN(valueNumber)) {
      setError("Please enter a numeric threshold.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      // Simpan threshold baru
      await Api.createThreshold({ value: valueNumber, note }, session.access_token);
      // Reset form
      setNote("");
      // Muat ulang KEDUA data
      await fetchLatest();
      await fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [thresholdValue, note, fetchHistory, fetchLatest, session]); 

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Configure Threshold</Text>
          
          {/* PERBAIKAN: Gunakan state 'currentThreshold' */}
          {currentThreshold !== null ? (
            <Text style={styles.metaText}>
              Current threshold: {Number(currentThreshold).toFixed(2)}°C
            </Text>
          ) : (
            // Tampilan loading terpisah untuk nilai saat ini
            <Text style={styles.metaText}>Memuat threshold...</Text>
          )}

          <Text style={styles.label}>Threshold (°C)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(thresholdValue)}
            onChangeText={setThresholdValue}
          />
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            placeholder="Describe why you are changing the threshold"
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Threshold</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Threshold History</Text>
          {/* Gunakan loading riwayat yang terpisah */}
          {loadingHistory && <ActivityIndicator />}
        </View>
        <DataTable
          columns={[
            {
              key: "created_at",
              title: "Saved At",
              render: (value) => (value ? new Date(value).toLocaleString() : "--"),
            },
            {
              key: "value",
              title: "Threshold (°C)",
              render: (value) =>
                typeof value === "number" ? `${Number(value).toFixed(2)}` : "--",
            },
            {
              key: "note",
              title: "Note",
              render: (value) => value || "-",
            },
          ]}
          data={history}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// (Styles Anda tetap sama persis)
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fb",
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
  label: {
    marginTop: 16,
    fontWeight: "600",
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  metaText: {
    color: "#666",
  },
  errorText: {
    marginTop: 12,
    color: "#c82333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});