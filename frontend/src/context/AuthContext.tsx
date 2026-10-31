import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrentUser } from '../types';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../services/api';

interface AuthContextType {
  user: CurrentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (body: { email: string; password: string; nickname: string; countryCode?: string }) => Promise<void>;
  guestLogin: (nickname?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateCoins: (coins: number) => void;
  equipCar: (carId: string) => Promise<void>;
  updateProfile: (data: { nickname?: string; avatarId?: string; countryCode?: string; bio?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.user) {
            setUser(res.user);
          } else {
            clearAuthToken();
            setTokenState(null);
          }
        } catch {
          clearAuthToken();
          setTokenState(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    if (res.token && res.user) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
    }
  };

  const register = async (body: { email: string; password: string; nickname: string; countryCode?: string }) => {
    const res = await api.register(body);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
    }
  };

  const guestLogin = async (nickname?: string) => {
    const res = await api.guestLogin(nickname);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    clearAuthToken();
    setTokenState(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  const updateCoins = (newCoins: number) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          coins: newCoins
        }
      };
    });
  };

  const equipCar = async (carId: string) => {
    await api.equipItem(carId, 'car');
    setUser(prev => {
      if (!prev) return null;
      const updatedInventory = prev.inventory.map(item => {
        if (item.itemType === 'car') {
          return { ...item, isEquipped: item.itemId === carId };
        }
        return item;
      });
      return {
        ...prev,
        inventory: updatedInventory
      };
    });
  };

  const updateProfile = async (data: { nickname?: string; avatarId?: string; countryCode?: string; bio?: string }) => {
    const res = await api.updateProfile(data);
    if (res.profile) {
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          profile: {
            ...prev.profile,
            ...res.profile
          }
        };
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        guestLogin,
        logout,
        refreshUser,
        updateCoins,
        equipCar,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
