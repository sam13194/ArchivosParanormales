'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';

interface UserProfile {
  id: number;
  email: string;
  displayName: string;
  role: 'user' | 'premium' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'pending' | 'banned';
  joinDate: string;
  lastLogin: string;
  storiesSubmitted: number;
  avatar?: string;
  firebase_uid: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isPremium: boolean;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();

  // Asegurar que solo se ejecute en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUserProfile = async (firebaseUid: string, email?: string) => {
    try {
      // Intentar primero con firebase_uid
      let response = await fetch(`/api/user/profile?firebase_uid=${firebaseUid}`);
      let result = await response.json();

      // Si no encuentra por firebase_uid y tenemos email, intentar por email
      if (response.ok && !result.profile && email) {
        console.log('Profile not found by firebase_uid, trying by email:', email);
        response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
        result = await response.json();

        // Si encontramos perfil por email pero no tiene firebase_uid, sincronizarlo
        if (result.profile && !result.profile.firebase_uid) {
          console.log('Syncing firebase_uid for user:', email);
          try {
            await fetch('/api/user/sync-firebase-uid', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, firebase_uid: firebaseUid })
            });
            // Actualizar el perfil con el nuevo UID
            result.profile.firebase_uid = firebaseUid;
          } catch (syncError) {
            console.error('Error syncing firebase_uid:', syncError);
          }
        }
      }

      if (!response.ok) {
        console.error('Error fetching user profile:', result.error);
        return null;
      }

      return result.profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!isClient || !user?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userProfile = await fetchUserProfile(user.uid, user.email || undefined);
    setProfile(userProfile);
    setLoading(false);
  };

  useEffect(() => {
    if (isClient) {
      refreshProfile();
    }
  }, [user, isClient]);

  // Computed properties
  const isAdmin = profile?.role === 'admin';
  const isModerator = profile?.role === 'moderator' || isAdmin;
  const isPremium = profile?.role === 'premium' || isModerator;

  // No renderizar hasta que estemos en el cliente
  if (!isClient) {
    return (
      <UserProfileContext.Provider value={{ 
        profile: null, 
        loading: true, 
        isAdmin: false, 
        isModerator: false, 
        isPremium: false, 
        refreshProfile: async () => {} 
      }}>
        {children}
      </UserProfileContext.Provider>
    );
  }

  return (
    <UserProfileContext.Provider value={{ 
      profile, 
      loading, 
      isAdmin, 
      isModerator, 
      isPremium, 
      refreshProfile 
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}