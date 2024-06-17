import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login } from '@/services/login-service';
import { UserLoginInfo } from '@/models/users';

interface User {
  email: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  Authlogin: (userInfo: UserLoginInfo) => Promise<any>;
  Authlogout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    if (storedUser && storedIsAuthenticated === 'true') {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false); 
  }, []);

  const authlogin = async (userInfo: UserLoginInfo) => {
    const validatedUser = await login(userInfo);
    if (validatedUser) {
      setIsAuthenticated(true);
      setUser({ email: validatedUser.email });
      localStorage.setItem('user', JSON.stringify({ email: validatedUser.email }));
      localStorage.setItem('isAuthenticated', 'true');

      setTimeout(() => {
        authlogout();
      }, 1800000); // 30min
    }
    return validatedUser;
  };

  const authlogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, Authlogin: authlogin, Authlogout: authlogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
