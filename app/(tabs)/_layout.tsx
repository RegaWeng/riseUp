import React from 'react';
import AdminTabs from '../components/AdminTabs';
import EmployerTabs from '../components/EmployerTabs';
import UserTabs from '../components/UserTabs';
import { useAuth } from '../context/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  // Render appropriate tab component based on user type
  if (user?.type === 'admin') {
    return <AdminTabs />;
  }
  
  if (user?.type === 'employer') {
    return <EmployerTabs />;
  }
  
  // Default to user tabs
  return <UserTabs />;
}

 