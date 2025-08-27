import { Stack } from "expo-router";
import { AdminProvider } from "../context/AdminContext";
import { AuthProvider } from "../context/AuthContext";
import { SavedProvider } from "../context/SavedContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AdminProvider>
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
      </AdminProvider>
    </AuthProvider>
  );
}
