import type { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LocationScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc: LocationObject = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Status Section - Small like home page */}
      <View style={styles.statusSection}>
        <Text style={styles.subtitle}>Your current location</Text>
        <Text style={styles.stats}>
          📍 GPS coordinates for job matching
        </Text>
      </View>

      {/* Large scrollable content area like home page */}
      <View style={styles.contentContainer}>
        <Text style={styles.coordinateText}>Latitude: {location?.coords.latitude}</Text>
        <Text style={styles.coordinateText}>Longitude: {location?.coords.longitude}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  stats: {
    fontSize: 14,
    color: '#666',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  coordinateText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});