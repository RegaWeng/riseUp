import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { SavedProvider } from "./context/SavedContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SavedProvider>
        <Stack
          screenOptions={{
            headerShown: false, // Hide the root stack header
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SavedProvider>
    </AuthProvider>
  );
}
