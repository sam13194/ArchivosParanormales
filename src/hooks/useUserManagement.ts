'use client';

import { useState, useEffect } from 'react';

// No more mock data - will use real API calls

interface User {
  id: number;
  email: string;
  displayName: string;
  role: string;
  status: string;
  joinDate: string;
  lastLogin: string;
  originalEmail?: string;
}

interface NewUserForm {
  email: string;
  displayName: string;
  role: string;
  status: string;
}

export function useUserManagement() {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('all');
  const [userFilterStatus, setUserFilterStatus] = useState('all');

  // Dialog states
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Form state
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    email: '',
    displayName: '',
    role: 'user',
    status: 'active'
  });

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users function
  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      
      // Make real API call
      const response = await fetch('/api/admin/users');
      const result = await response.json();
      
      if (result.success) {
        console.log('Loaded users:', result.users);
        setUsers(result.users || []);
      } else {
        console.error('Error loading users:', result.error);
        setUsers([]);
      }
      
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.displayName?.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userFilterRole === 'all' || user.role === userFilterRole;
    const matchesStatus = userFilterStatus === 'all' || user.status === userFilterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Utility functions
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'editor': return 'default';
      case 'user': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  // User management functions
  const updateUserStatus = async (userId: number, newStatus: string) => {
    try {
      console.log('updateUserStatus called with:', { userId, newStatus, type: typeof userId });
      
      if (!userId || userId === undefined) {
        throw new Error('User ID is required');
      }
      
      // Make real API call
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
        alert(`Estado del usuario actualizado a ${newStatus}`);
      } else {
        throw new Error(result.error || 'Error actualizando usuario');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error al actualizar el estado del usuario');
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      console.log('updateUserRole called with:', { userId, newRole, type: typeof userId });
      
      if (!userId || userId === undefined) {
        throw new Error('User ID is required');
      }
      
      // Make real API call
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol: newRole }),
      });
      
      console.log('API response status:', response.status);
      const result = await response.json();
      console.log('API response result:', result);

      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        alert(`Rol del usuario actualizado a ${newRole}`);
      } else {
        throw new Error(result.error || 'Error actualizando usuario');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error al actualizar el rol del usuario');
    }
  };

  const createNewUser = async () => {
    if (!newUserForm.email || !newUserForm.displayName) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      // Make real API call
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUserForm.email,
          display_name: newUserForm.displayName,
          rol: newUserForm.role,
          send_invite: true
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Reload users to get the new user from database
        await loadUsers();
        
        // Reset form
        setNewUserForm({
          email: '',
          displayName: '',
          role: 'user',
          status: 'active'
        });
        
        setIsCreateUserDialogOpen(false);
        alert('Usuario creado exitosamente');
      } else {
        throw new Error(result.error || 'Error creando usuario');
      }
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear el usuario');
    }
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setIsEditUserDialogOpen(true);
  };

  const updateUser = async (updatedUser: User) => {
    try {
      console.log('updateUser called with:', updatedUser);
      
      if (!updatedUser || !updatedUser.id) {
        throw new Error('User and User ID are required');
      }
      
      // Make real API call
      const response = await fetch(`/api/admin/users?id=${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_name: updatedUser.displayName,
          rol: updatedUser.role,
          estado: updatedUser.status
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUsers(prev => prev.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ));
        
        setEditingUser(null);
        setIsEditUserDialogOpen(false);
        alert('Usuario actualizado exitosamente');
      } else {
        throw new Error(result.error || 'Error actualizando usuario');
      }
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar el usuario');
    }
  };

  const deleteUser = async (user: User) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.displayName}?`)) {
      return;
    }

    try {
      // Make real API call
      const response = await fetch(`/api/admin/users?id=${user.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        alert('Usuario eliminado exitosamente');
      } else {
        throw new Error(result.error || 'Error eliminando usuario');
      }
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const resetUserPassword = async (userEmail: string) => {
    try {
      const response = await fetch('/api/admin/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Email de restablecimiento enviado exitosamente');
      } else {
        alert(result.error || result.message || 'Error al enviar el email de restablecimiento');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error al enviar el email de restablecimiento');
    }
  };

  const setCustomPassword = async (userEmail: string) => {
    const newPassword = prompt('Ingresa la nueva contraseña:');
    if (!newPassword) return;

    try {
      const response = await fetch('/api/admin/users/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: newPassword }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Contraseña actualizada exitosamente');
      } else {
        alert(result.error || result.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error setting password:', error);
      alert('Error al actualizar la contraseña');
    }
  };

  return {
    // State
    users,
    isLoadingUsers,
    userSearchTerm,
    setUserSearchTerm,
    userFilterRole,
    setUserFilterRole,
    userFilterStatus,
    setUserFilterStatus,
    
    // Dialog states
    isCreateUserDialogOpen,
    setIsCreateUserDialogOpen,
    editingUser,
    setEditingUser,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    userToDelete,
    setUserToDelete,
    
    // Form state
    newUserForm,
    setNewUserForm,
    
    // Computed values
    filteredUsers,
    
    // Functions
    loadUsers,
    getRoleBadgeColor,
    getStatusBadgeColor,
    updateUserStatus,
    updateUserRole,
    createNewUser,
    editUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    setCustomPassword
  };
}