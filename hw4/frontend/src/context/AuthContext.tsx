import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../config/api';

type AuthUser = {
  userId: number;
  username: string;
  profilePictureUrl: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    setLoading(true);

    try {
      const authResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!authResponse.ok) {
        setUser(null);
        return;
      }

      const authData = await authResponse.json() as { userId: number; username: string };

      const profileResponse = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!profileResponse.ok) {
        setUser(null);
        return;
      }

      const profile = await profileResponse.json() as { profile_picture_url: string | null };

      // Fetch the profile picture from dedicated endpoint for fresh display
      let pictureUrl = profile.profile_picture_url;
      try {
        const picResponse = await fetch(`${API_BASE_URL}/users/profile-picture`, {
          credentials: 'include',
        });

        if (picResponse.ok) {
          const contentType = picResponse.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const picData = await picResponse.json() as { profilePictureUrl: string | null };
            pictureUrl = picData.profilePictureUrl;
          } else if (contentType?.includes('image')) {
            // If it's an image blob, create object URL
            const picBlob = await picResponse.blob();
            pictureUrl = URL.createObjectURL(picBlob);
          }
        }
      } catch {
        // Fall back to profile_picture_url if dedicated endpoint fails
      }

      setUser({
        userId: authData.userId,
        username: authData.username,
        profilePictureUrl: pictureUrl,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshAuth,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
