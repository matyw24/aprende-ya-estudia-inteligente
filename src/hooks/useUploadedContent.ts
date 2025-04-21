
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface UploadedContent {
  id?: string;
  title: string;
  content: string;
  file_name?: string | null;
  created_at?: string;
}

export const useUploadedContent = () => {
  const [uploadedContents, setUploadedContents] = useState<UploadedContent[]>([]);
  const { user } = useAuth();

  const generateTitle = (content: string, fileName?: string): string => {
    if (fileName) {
      // Remove file extension and replace dashes/underscores with spaces
      return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    }
    
    // Try to find a title in the content (e.g., first heading or first line)
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Look for heading patterns (# Title, ## Title, etc.)
    const headingMatch = content.match(/^#+\s+(.+)$/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
    
    // Look for capitalized segments that might be titles
    const potentialTitleLine = lines.find(line => 
      line.length < 100 && 
      (line.toUpperCase() === line || /^[A-Z][^.!?]*[.!?]$/.test(line))
    );
    
    if (potentialTitleLine) {
      return potentialTitleLine.trim();
    }
    
    // If we still don't have a title, take the first non-empty line
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // Truncate if too long
      return firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine;
    }
    
    // Fallback: date-based title
    return `Contenido del ${new Date().toLocaleDateString('es-ES')}`;
  };

  const saveContent = async (content: string, title: string, fileName?: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para cargar contenido");
      return null;
    }

    try {
      const generatedTitle = title || generateTitle(content, fileName);

      const { data, error } = await supabase
        .from('uploaded_content')
        .insert({
          user_id: user.id,
          content,
          title: generatedTitle,
          file_name: fileName
        })
        .select()
        .single();

      if (error) throw error;

      const newContent = data as UploadedContent;
      setUploadedContents(prev => [...prev, newContent]);
      toast.success("Contenido cargado exitosamente");
      return newContent;
    } catch (error) {
      console.error('Error al guardar contenido:', error);
      toast.error("Error al cargar el contenido");
      return null;
    }
  };

  const fetchUploadedContents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('uploaded_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploadedContents(data || []);
    } catch (error) {
      console.error('Error al obtener contenidos:', error);
      toast.error("Error al obtener los contenidos");
    }
  };

  const getContentById = (id: string): UploadedContent | undefined => {
    return uploadedContents.find(content => content.id === id);
  };

  const deleteContent = async (id: string | undefined) => {
    if (!user || !id) return;

    try {
      const { error } = await supabase
        .from('uploaded_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setUploadedContents(prev => prev.filter(c => c.id !== id));
      toast.success("Contenido eliminado");
    } catch (error) {
      console.error('Error al borrar contenido:', error);
      toast.error("No se pudo eliminar el contenido");
    }
  };

  return { 
    uploadedContents, 
    saveContent, 
    fetchUploadedContents,
    getContentById,
    deleteContent
  };
};
