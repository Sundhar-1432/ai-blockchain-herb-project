import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

export type UserRole = 'farmer' | 'manufacturer' | 'auditor';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;

  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('ayurtrace_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
  try {
      console.log("LOGIN FUNCTION RUNNING");
    const response = await axios.post(
      "/api/login/",
      {
        username: email,      // MUST send username
        password: password
      }
    );

    const { access, role, name } = response.data;

    // Store JWT
    localStorage.setItem("token", access);
    localStorage.setItem("role", role);

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: name || email,
      role,
    };

    setUser(newUser);
    localStorage.setItem('ayurtrace_user', JSON.stringify(newUser));

  } catch (error) {
    throw new Error("Login failed");
  }
};


 const signup = async (name: string, email: string, password: string, role: UserRole) => {
  try {
    await axios.post(
      "/api/register/",
      {
          username: email,      // username = email
          email: email,
          password: password,
          role: role,
          first_name: name
      }
    );

    // Auto login after signup
    await login(email, password);

  } catch (error) {
    throw new Error("Signup failed");
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('ayurtrace_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
    }}>
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
