import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAdmin } from '../context/AdminContext';

interface AdminToggleProps {
  style?: any;
}

export function AdminToggle({ style }: AdminToggleProps) {
  const { viewMode, setViewMode, isAdminView } = useAdmin();

  if (!isAdminView) {
    return null; // Don't show toggle for non-admin users
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Admin View:</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'user' && styles.activeToggle
          ]}
          onPress={() => setViewMode('user')}
        >
          <Text style={[
            styles.toggleText,
            viewMode === 'user' && styles.activeToggleText
          ]}>
            User Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'employer' && styles.activeToggle
          ]}
          onPress={() => setViewMode('employer')}
        >
          <Text style={[
            styles.toggleText,
            viewMode === 'employer' && styles.activeToggleText
          ]}>
            Employer Data
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  activeToggleText: {
    color: 'white',
  },
});
