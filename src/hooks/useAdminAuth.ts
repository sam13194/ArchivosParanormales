'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export function useAdminAuth() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (authLoading) return;
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user exists in profiles table with admin role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.uid)
          .single();

        if (error) {
          console.log('No profile found, checking admin emails');
          // Fallback: check if email is in admin list
          const adminEmails = ['wilmer13194@gmail.com'];
          setIsAdmin(adminEmails.includes(user.email || ''));
        } else {
          setIsAdmin(profile.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        // Fallback: check if email is in admin list
        const adminEmails = ['wilmer13194@gmail.com'];
        setIsAdmin(adminEmails.includes(user.email || ''));
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
}