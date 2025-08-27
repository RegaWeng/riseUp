import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiService, User } from '../services/api';

export type UserType = 'admin' | 'employer' | 'user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, type: UserType) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for stored token on app start
  useEffect(() => {
    const checkStoredAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          apiService.setToken(token);
          const currentUser = await apiService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking stored auth:', error);
        await AsyncStorage.removeItem('authToken');
        apiService.clearToken();
      }
    };

    checkStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login({ email, password });
      setUser(response.user);
      await AsyncStorage.setItem('authToken', response.token);
      apiService.setToken(response.token);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, type: UserType): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.register({ name, email, password, type });
      setUser(response.user);
      await AsyncStorage.setItem('authToken', response.token);
      apiService.setToken(response.token);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('authToken');
    apiService.clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
