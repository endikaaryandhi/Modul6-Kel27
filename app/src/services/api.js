import { supabase } from './supabase'; 

// GANTI DENGAN ALAMAT IP LOKAL 
const API_URL = 'http://10.91.156.189:3000/api'; 

export const Api = {
  // Fungsi untuk MonitoringScreen
  async getSensorReadings(page = 1) {
    try {
      const response = await fetch(`${API_URL}/readings?page=${page}`);
      if (!response.ok) throw new Error(`Gagal mengambil data sensor`);
      return await response.json();
    } catch (error) {
      console.error('fetchReadings error:', error);
      throw new Error(`Network request failed: ${error.message}`);
    }
  },

  // Fungsi untuk RIWAYAT di ControlScreen
  async getThresholds(token) {
    try {
      const response = await fetch(`${API_URL}/thresholds`, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) throw new Error('Unauthorized.');
      if (!response.ok) throw new Error(`Gagal mengambil riwayat threshold`);
      return await response.json();
    } catch (error) {
      console.error('getThresholds error:', error);
      throw error;
    }
  },

  // Fungsi untuk NILAI SAAT INI di ControlScreen (CEPAT)
  async getLatestThreshold(token) {
    try {
      const response = await fetch(`${API_URL}/thresholds/latest`, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) throw new Error('Unauthorized.');
      if (!response.ok) throw new Error(`Gagal mengambil threshold saat ini`);
      return await response.json();
    } catch (error) {
      console.error('getLatestThreshold error:', error);
      throw error;
    }
  },
  
  // Fungsi untuk Menyimpan di ControlScreen
  async createThreshold({ value, note }, token) {
    try {
      const response = await fetch(`${API_URL}/thresholds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ value, note }), 
      });
      if (response.status === 401) throw new Error('Unauthorized.');
      if (!response.ok) throw new Error(`Gagal memperbarui threshold`);
      return await response.json();
    } catch (error) {
      console.error('createThreshold error:', error);
      throw error;
    }
  },
};

export { supabase };