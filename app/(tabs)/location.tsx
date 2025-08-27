import type { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

export default function LocationScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc: LocationObject = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      
      // Set initial map region
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01, // Zoom level
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
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

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {location && region ? (
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={handleRegionChange}
            showsUserLocation={true}
            showsMyLocationButton={true}
            zoomEnabled={true}
            scrollEnabled={true}
            rotateEnabled={true}
            pitchEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
              description="Current GPS coordinates"
            />
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
      </View>

      {/* Coordinates Display */}
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinateText}>Latitude: {location?.coords.latitude?.toFixed(6)}</Text>
        <Text style={styles.coordinateText}>Longitude: {location?.coords.longitude?.toFixed(6)}</Text>
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
  map: {
    flex: 1,
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
  coordinatesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  coordinateText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});