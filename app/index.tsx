import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from './context/AuthContext';

export default function Index() {
  const { user } = useAuth();
  
  if (!user) {
    return <Redirect href="/login" />;
  }
  
  // Redirect based on user type
  if (user.type === 'employer') {
    return <Redirect href="/(tabs)/employer-home" />;
  }
  
  return <Redirect href="/(tabs)" />;
}
