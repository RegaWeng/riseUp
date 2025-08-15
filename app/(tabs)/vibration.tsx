import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Pressable, Text, Vibration, View } from 'react-native';

export default function VibrationScreen() {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startVibrating = () => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval (() => {

            //Haptics works best on iOS; Vibration workds on Android
            Haptics.impactAsync(Haptics. ImpactFeedbackStyle.Medium);
            Vibration.vibrate(50, false);
        }, 120);
    };

    const stopVibrating = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        Vibration.cancel();
    };

    return (
        <View style={{ flex:1, alignItems: 'center', justifyContent: 'center '}}>
        <Pressable
            onPressIn={startVibrating}
            onPressOut={stopVibrating}
            style={({ pressed }) => ({
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                backgroundColor: pressed ? '#2563eb' : '#3b82f6',
            })}
            >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600'}}>
                Hold to Vibrate
            </Text>
        </Pressable>
        </View>
        );
    }