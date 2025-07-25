import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import { createContext, ReactNode, useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SavedProvider } from '../context/SavedContext';

// Tab colors mapping
const TAB_COLORS = {
  index: '#007AFF',      // Home - Blue
  training: '#34C759',   // Training - Green
  saved: '#FF9500',      // Saved - Orange
  profile: '#5856D6',    // Profile - Purple
};

// Context for tracking active tab
interface TabContextType {
  activeTab: keyof typeof TAB_COLORS;
  setActiveTab: (tab: keyof typeof TAB_COLORS) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within TabProvider');
  }
  return context;
};

const TabProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<keyof typeof TAB_COLORS>('index');
  
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

// Custom header component with dynamic colors
const CustomHeader = () => {
  const { activeTab } = useTabContext();
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const headerColor = TAB_COLORS[activeTab];

  if (!fontsLoaded) {
    return (
      <View style={[styles.headerContainer, { backgroundColor: headerColor }]}>
        <Text style={styles.headerTitle}>Rise Up</Text>
      </View>
    );
  }

  return (
    <View style={[styles.headerContainer, { backgroundColor: headerColor }]}>
      <Text style={[styles.headerTitle, { fontFamily: 'SpaceMono' }]}>Rise Up</Text>
    </View>
  );
};

export default function TabLayout() {
  return (
    <TabProvider>
      <SavedProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            headerShown: true, // Show the header
            header: () => <CustomHeader />, // Use our custom header
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="training"
            options={{
              title: 'Training',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'school' : 'school-outline'} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="saved"
            options={{
              title: 'Saved',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </SavedProvider>
    </TabProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
}); 