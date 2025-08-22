import { createContext, ReactNode, useContext, useState } from 'react';

export type UserType = 'admin' | 'employer' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: UserType) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data for demonstration
const SAMPLE_USERS = [
  {
    id: '1',
    email: 'admin@riseup.com',
    password: 'admin123',
    name: 'Admin User',
    type: 'admin' as UserType,
  },
  {
    id: '2',
    email: 'employer@company.com',
    password: 'employer123',
    name: 'John Employer',
    type: 'employer' as UserType,
  },
  {
    id: '3',
    email: 'user@example.com',
    password: 'user123',
    name: 'Jane User',
    type: 'user' as UserType,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string, userType: UserType): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in sample data
    const foundUser = SAMPLE_USERS.find(
      u => u.email === email && u.password === password && u.type === userType
    );
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        type: foundUser.type,
      };
      setUser(userData);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
