import type { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

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
    <View>
      <Text>Latitude: {location?.coords.latitude}</Text>
      <Text>Longitude: {location?.coords.longitude}</Text>
    </View>
  );
}