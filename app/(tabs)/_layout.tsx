import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { router, Tabs } from 'expo-router';
import { createContext, ReactNode, useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Tab colors mapping
const TAB_COLORS = {
  index: '#007AFF',      // Home - Blue
  training: '#34C759',   // Training - Green
  saved: '#FF9500',      // Saved - Orange
  profile: '#5856D6',    // Profile - Purple
  'employer-home': '#007AFF',      // Jobs - Blue
  'employer-applicants': '#34C759', // Applicants - Green
  'employer-saved': '#FF9500',      // Starred - Orange
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<keyof typeof TAB_COLORS>(
    user?.type === 'employer' ? 'employer-home' : 'index'
  );
  
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

// Custom header component with dynamic colors
const CustomHeader = () => {
  const { activeTab } = useTabContext();
  const { user, logout } = useAuth();
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const headerColor = TAB_COLORS[activeTab];

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.headerContainer, { backgroundColor: headerColor }]}>
        <Text style={styles.headerTitle}>Rise Up</Text>
        {user && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.headerContainer, { backgroundColor: headerColor }]}>
      <Text style={[styles.headerTitle, { fontFamily: 'SpaceMono' }]}>Rise Up</Text>
      {user && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function TabLayout() {
  const { user } = useAuth();

  // Show different tabs based on user type
  if (user?.type === 'admin') {
    return (
      <TabProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            headerShown: true,
            header: () => <CustomHeader />,
          }}
        >
          {/* User tabs */}
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
            name="location"
            options={{
              title: 'Location',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'location' : 'location-outline'} size={24} color={color} />
              ),
            }}
          />
          {/* Employer tabs */}
          <Tabs.Screen
            name="employer-home"
            options={{
              title: 'Jobs',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="employer-applicants"
            options={{
              title: 'Applicants',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="employer-saved"
            options={{
              title: 'Starred',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'star' : 'star-outline'} size={24} color={color} />
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
      </TabProvider>
    );
  }

  if (user?.type === 'employer') {
    return (
      <TabProvider>
        <Tabs
          initialRouteName="employer-home"
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            headerShown: true,
            header: () => <CustomHeader />,
          }}
        >
          <Tabs.Screen
            name="employer-home"
            options={{
              title: 'Jobs',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="employer-applicants"
            options={{
              title: 'Applicants',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="employer-saved"
            options={{
              title: 'Starred',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'star' : 'star-outline'} size={24} color={color} />
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
          {/* Hide user-specific tabs from employer */}
          <Tabs.Screen
            name="index"
            options={{
              href: null, // This hides the tab
            }}
          />
          <Tabs.Screen
            name="training"
            options={{
              href: null, // This hides the tab
            }}
          />
          <Tabs.Screen
            name="saved"
            options={{
              href: null, // This hides the tab
            }}
          />
          <Tabs.Screen
            name="location"
            options={{
              href: null, // This hides the tab
            }}
          />
        </Tabs>
      </TabProvider>
    );
  }

  // Default user tabs
  return (
    <TabProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: true,
          header: () => <CustomHeader />,
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
          name="location"
          options={{
            title: 'Location',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'location' : 'location-outline'} size={24} color={color} />
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
        {/* Hide employer-specific tabs from user */}
        <Tabs.Screen
          name="employer-home"
          options={{
            href: null, // This hides the tab
          }}
        />
        <Tabs.Screen
          name="employer-applicants"
          options={{
            href: null, // This hides the tab
          }}
        />
        <Tabs.Screen
          name="employer-saved"
          options={{
            href: null, // This hides the tab
          }}
        />
      </Tabs>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 