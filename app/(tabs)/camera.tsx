import type { CameraCapturedPicture } from 'expo-camera';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRef } from 'react';
import { Alert, Button, Text, View } from 'react-native';

export default function CameraScreen() {
  // Hooks must be at the top level
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async (): Promise<void> => {
    try {
      if (!cameraPermission?.granted) {
        const res = await requestCameraPermission();
        if (!res?.granted) return;
      }

      if (!cameraRef.current) return;

      const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync();

      // Save to system Photos/Gallery
      if (!mediaPermission?.granted) {
        const res = await requestMediaPermission();
        if (!res?.granted) {
          Alert.alert('Permission required', 'Enable Photos/Media permission to save pictures.');
          return;
        }
      }
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      console.log('Saved to library:', photo.uri);
    } catch (err) {
      console.error('takePicture error:', err);
    }
  };

  if (!cameraPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <Text>We need your permission to use the camera</Text>
        <Button title="Grant permission" onPress={requestCameraPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} ref={cameraRef} />
      <Button title="Take Photo" onPress={takePicture} />
    </View>
  );
}