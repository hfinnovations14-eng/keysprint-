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
  ensureGuestSession: (nickname?: string) => Promise<CurrentUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateCoins: (coins: number) => void;
  equipCar: (carId: string) => Promise<void>;
  purchaseCar: (carId: string, cost?: number, itemType?: string) => Promise<{ success: boolean; error?: string }>;
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

  const ensureGuestSession = async (nickname?: string): Promise<CurrentUser> => {
    if (user) return user;
    const storedToken = getAuthToken();
    if (storedToken) {
      try {
        const res = await api.getMe();
        if (res.user) {
          setUser(res.user);
          return res.user;
        }
      } catch {
        clearAuthToken();
        setTokenState(null);
      }
    }

    const res = await api.guestLogin(nickname);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Failed to create guest session');
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

  const equipCar = async (carId: string): Promise<void> => {
    try {
      await api.equipItem(carId, 'car');
      await refreshUser();
    } catch (err: any) {
      console.error('Failed to equip car:', err);
      throw err;
    }
  };

  const purchaseCar = async (carId: string, cost?: number, itemType: string = 'car'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.purchaseStoreItem(carId, cost, itemType);
      if (res.item || res.coins !== undefined) {
        if (typeof res.coins === 'number') {
          updateCoins(res.coins);
        }
        await refreshUser();
        return { success: true };
      }
      throw new Error('Purchase could not be verified by server');
    } catch (err: any) {
      const msg = err.message || 'Purchase error';
      console.error('Purchase error:', msg);
      throw new Error(msg);
    }
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
        ensureGuestSession,
        logout,
        refreshUser,
        updateCoins,
        equipCar,
        purchaseCar,
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
