
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

  const saveContent = async (content: string, title: string, fileName?: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para cargar contenido");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('uploaded_content')
        .insert({
          user_id: user.id,
          content,
          title: title || "Contenido sin título",
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

  return { 
    uploadedContents, 
    saveContent, 
    fetchUploadedContents 
  };
};
