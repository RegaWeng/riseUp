import type { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LocationScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission denied');
          return;
        }

        const loc: LocationObject = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        setLocation(loc);
      } catch (error) {
        console.error('Location error:', error);
        setLocationError('Failed to get location');
      }
    })();
  }, []);

  const openInMaps = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const getAddressFromCoords = (lat: number, lng: number) => {
    // This is a simple approximation - in a real app you'd use a geocoding service
    if (lat === 37.421998 && lng === -122.084000) {
      return "Googleplex, Mountain View, CA";
    }
    return "Location coordinates";
  };

  return (
    <View style={styles.container}>
      {/* Status Section - Small like home page */}
      <View style={[styles.statusSection, { backgroundColor: '#5856D6' }]}>
        <Text style={[styles.subtitle, { color: 'white' }]}>Your current location</Text>
        <Text style={[styles.stats, { color: 'rgba(255,255,255,0.8)' }]}>
          📍 GPS coordinates for job matching
        </Text>
      </View>

      {/* Map Placeholder Container */}
      <View style={styles.mapContainer}>
        {location ? (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapTitle}>📍 Your Location</Text>
            <Text style={styles.mapAddress}>
              {getAddressFromCoords(location.coords.latitude, location.coords.longitude)}
            </Text>
            <TouchableOpacity style={styles.openMapsButton} onPress={openInMaps}>
              <Text style={styles.openMapsText}>Open in Google Maps</Text>
            </TouchableOpacity>
            <View style={styles.mapInfo}>
              <Text style={styles.mapInfoText}>Tap to view in Google Maps</Text>
              <Text style={styles.mapInfoText}>This will open your default map app</Text>
            </View>
          </View>
        ) : locationError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Location Error: {locationError}</Text>
            <Text style={styles.errorText}>Please enable location services</Text>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        )}
      </View>

      {/* Coordinates Display */}
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinateTitle}>GPS Coordinates</Text>
        <Text style={styles.coordinateText}>
          Latitude: {location?.coords.latitude?.toFixed(6) || 'Loading...'}
        </Text>
        <Text style={styles.coordinateText}>
          Longitude: {location?.coords.longitude?.toFixed(6) || 'Loading...'}
        </Text>
        {location && (
          <Text style={styles.accuracyText}>
            Accuracy: ±{location.coords.accuracy?.toFixed(1) || 'Unknown'} meters
          </Text>
        )}
        {locationError && <Text style={styles.errorText}>⚠️ {locationError}</Text>}
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
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  mapAddress: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  openMapsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  openMapsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mapInfo: {
    alignItems: 'center',
  },
  mapInfoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 5,
  },
  coordinatesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  coordinateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  coordinateText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
});