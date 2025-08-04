'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Eye, 
  FileText, 
  ShoppingCart, 
  Users 
} from "lucide-react";

// Import custom hooks
import { useStoryManagement } from '@/hooks/useStoryManagement';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useHomepageConfig } from '@/hooks/useHomepageConfig';

// Import modular components
import Dashboard from '@/components/admin/dashboard/Dashboard';
import VistaPrincipal from '@/components/admin/vista-principal/VistaPrincipal';
import NuevaHistoria from '@/components/admin/nueva-historia/NuevaHistoria';
import Contenido from '@/components/admin/contenido/Contenido';
import Tienda from '@/components/admin/tienda/Tienda';
import Usuarios from '@/components/admin/usuarios/Usuarios';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: profileLoading } = useAuth();
  
  // Check if user is admin - allow your email for now
  const isAdmin = user?.email === 'wilmer13194@gmail.com' || user?.email?.includes('admin');

  // Initialize hooks
  const storyManagement = useStoryManagement();
  const userManagement = useUserManagement();
  const homepageConfig = useHomepageConfig();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!profileLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      if (!isAdmin) {
        router.push('/');
        return;
      }
    }
  }, [user, profileLoading, isAdmin, router]);

  // Show loading while checking authentication
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona el contenido y configuración de Archivos Paranormales</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="homepage">
              <Eye className="h-4 w-4 mr-2" />
              Vista Principal
            </TabsTrigger>
            <TabsTrigger value="create-story">
              <FileText className="h-4 w-4 mr-2" />
              Nueva Historia
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Contenido
            </TabsTrigger>
            <TabsTrigger value="store">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Tienda
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Usuarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Dashboard 
              formatCurrency={homepageConfig.formatCurrency}
              getActivityIcon={homepageConfig.getActivityIcon}
              getStatusBadge={homepageConfig.getStatusBadge}
            />
          </TabsContent>

          <TabsContent value="homepage" className="space-y-6">
            <VistaPrincipal
              homepageConfig={homepageConfig.homepageConfig}
              setHomepageConfig={homepageConfig.setHomepageConfig}
              filteredStories={homepageConfig.filteredStories}
              categories={homepageConfig.categories}
              searchTerm={homepageConfig.searchTerm}
              setSearchTerm={homepageConfig.setSearchTerm}
              selectedCategory={homepageConfig.selectedCategory}
              setSelectedCategory={homepageConfig.setSelectedCategory}
              setHeroStory={homepageConfig.setHeroStory}
              addStoryToCarousel={homepageConfig.addStoryToCarousel}
              removeStoryFromCarousel={homepageConfig.removeStoryFromCarousel}
              moveCarousel={homepageConfig.moveCarousel}
              saveHomepageConfig={homepageConfig.saveHomepageConfig}
              mockAllStories={homepageConfig.mockAllStories}
            />
          </TabsContent>

          <TabsContent value="create-story" className="space-y-6">
            <NuevaHistoria
              newStoryForm={storyManagement.newStoryForm}
              setNewStoryForm={storyManagement.setNewStoryForm}
              validationErrors={storyManagement.validationErrors}
              audioFile={storyManagement.audioFile}
              setAudioFile={storyManagement.setAudioFile}
              imageFile={storyManagement.imageFile}
              setImageFile={storyManagement.setImageFile}
              jsonFile={storyManagement.jsonFile}
              setJsonFile={storyManagement.setJsonFile}
              isUploadingFiles={storyManagement.isUploadingFiles}
              isSubmittingStory={storyManagement.isSubmittingStory}
              isLoadingJson={storyManagement.isLoadingJson}
              handleFileUpload={storyManagement.handleFileUpload}
              handleJsonLoad={storyManagement.handleJsonLoad}
              downloadJsonTemplate={storyManagement.downloadJsonTemplate}
              clearForm={storyManagement.clearForm}
              createNewStory={storyManagement.createNewStory}
              addTestigoSecundario={storyManagement.addTestigoSecundario}
              removeTestigoSecundario={storyManagement.removeTestigoSecundario}
              updateTestigoSecundario={storyManagement.updateTestigoSecundario}
            />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Contenido />
          </TabsContent>

          <TabsContent value="store" className="space-y-6">
            <Tienda />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Usuarios
              users={userManagement.users}
              isLoadingUsers={userManagement.isLoadingUsers}
              userSearchTerm={userManagement.userSearchTerm}
              setUserSearchTerm={userManagement.setUserSearchTerm}
              userFilterRole={userManagement.userFilterRole}
              setUserFilterRole={userManagement.setUserFilterRole}
              userFilterStatus={userManagement.userFilterStatus}
              setUserFilterStatus={userManagement.setUserFilterStatus}
              filteredUsers={userManagement.filteredUsers}
              updateUserStatus={userManagement.updateUserStatus}
              updateUserRole={userManagement.updateUserRole}
              getRoleBadgeColor={userManagement.getRoleBadgeColor}
              getStatusBadgeColor={userManagement.getStatusBadgeColor}
              createNewUser={userManagement.createNewUser}
              editUser={userManagement.editUser}
              deleteUser={userManagement.deleteUser}
              resetUserPassword={userManagement.resetUserPassword}
              setCustomPassword={userManagement.setCustomPassword}
              isCreateUserDialogOpen={userManagement.isCreateUserDialogOpen}
              setIsCreateUserDialogOpen={userManagement.setIsCreateUserDialogOpen}
              isEditUserDialogOpen={userManagement.isEditUserDialogOpen}
              setIsEditUserDialogOpen={userManagement.setIsEditUserDialogOpen}
              editingUser={userManagement.editingUser}
              setEditingUser={userManagement.setEditingUser}
              newUserForm={userManagement.newUserForm}
              setNewUserForm={userManagement.setNewUserForm}
              updateUser={userManagement.updateUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}