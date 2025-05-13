import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      console.log('AuthProvider: Auth state changed', { user });
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error('AuthProvider: Auth state error', error);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Attempting signup');
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('AuthProvider: Signup successful');
    } catch (error) {
      console.error('AuthProvider: Signup error', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Attempting login');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthProvider: Login successful');
    } catch (error) {
      console.error('AuthProvider: Login error', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('AuthProvider: Attempting logout');
      await signOut(auth);
      console.log('AuthProvider: Logout successful');
    } catch (error) {
      console.error('AuthProvider: Logout error', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  console.log('AuthProvider: Rendering with loading state:', loading);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 