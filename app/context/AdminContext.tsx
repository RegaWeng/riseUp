import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  viewMode: 'user' | 'employer';
  setViewMode: (mode: 'user' | 'employer') => void;
  isAdminView: boolean;
  getCurrentUserType: () => 'user' | 'employer';
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'user' | 'employer'>('user');
  
  const isAdminView = user?.type === 'admin';
  
  // Get the effective user type for storage operations
  const getCurrentUserType = (): 'user' | 'employer' => {
    if (user?.type === 'admin') {
      return viewMode; // Admin can switch between views
    }
    return user?.type === 'employer' ? 'employer' : 'user';
  };

  return (
    <AdminContext.Provider value={{
      viewMode,
      setViewMode,
      isAdminView,
      getCurrentUserType,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
