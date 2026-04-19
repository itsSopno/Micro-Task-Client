import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null;
  coins: number;
  createUser: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  googleSignIn: () => Promise<any>;
  logOut: () => Promise<any>;
  updateUser: (name: string, photo: string) => Promise<any>;
  refreshCoins: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);

  const googleProvider = new GoogleAuthProvider();

  const createUser = (email: string, password: string) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    localStorage.removeItem('access-token');
    setRole(null);
    return signOut(auth);
  };

  const updateUser = (name: string, photo: string) => {
    return updateProfile(auth.currentUser!, {
      displayName: name,
      photoURL: photo,
    });
  };

  const refreshCoins = async () => {
    if (user?.email) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/coins/${user.email}`);
        setCoins(res.data.coins);
      } catch (error) {
        console.error("Error refreshing coins", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser?.email) {
        // Get JWT
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt`, { email: currentUser.email });
          localStorage.setItem('access-token', res.data.token);
          
          // Get Role
          const roleRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${currentUser.email}`);
          setRole(roleRes.data.role);
          
          // Get Coins
          const coinRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/coins/${currentUser.email}`);
          setCoins(coinRes.data.coins);
        } catch (error) {
          console.error("Auth initialization error", error);
        }
      } else {
        localStorage.removeItem('access-token');
        setRole(null);
        setCoins(0);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    role,
    coins,
    createUser,
    signIn,
    googleSignIn,
    logOut,
    updateUser,
    refreshCoins
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
