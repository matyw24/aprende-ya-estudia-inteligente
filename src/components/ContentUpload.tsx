
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Link as LinkIcon, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUploadedContent } from "@/hooks/useUploadedContent";
import { Card } from "@/components/ui/card";

const ContentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [directText, setDirectText] = useState("");
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveContent, uploadedContents, fetchUploadedContents } = useUploadedContent();

  useEffect(() => {
    fetchUploadedContents();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const processContent = async (content: string, fileName?: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-content', {
        body: { content }
      });

      if (error) throw error;

      const savedContent = await saveContent(content, fileName || "Contenido importado", fileName);
      
      if (savedContent) {
        toast.success("Contenido procesado exitosamente");
        setDirectText("");
        setUrl("");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error al procesar:', error);
      toast.error("Error al procesar el contenido");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        await processContent(text, selectedFile.name);
      };
      reader.readAsText(selectedFile);
    } else if (directText) {
      await processContent(directText);
    } else if (url) {
      try {
        const response = await fetch(url);
        const text = await response.text();
        await processContent(text, url);
      } catch (error) {
        console.error('Error al obtener contenido de URL:', error);
        toast.error("Error al obtener contenido de la URL");
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Cargar Contenido</h2>
        
        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span>Texto</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>URL</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pdf" className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-secondary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="mb-2 text-muted-foreground">
                Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionar
              </p>
              {selectedFile && (
                <p className="text-sm font-medium text-primary">{selectedFile.name}</p>
              )}
              <input
                type="file"
                accept=".pdf,.txt"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Escribe o pega tu contenido aquí..."
              value={directText}
              onChange={(e) => setDirectText(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <Input
              type="url"
              placeholder="https://ejemplo.com/articulo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Ingresa la URL de un sitio web académico o artículo en línea.
            </p>
          </TabsContent>
          
          <div className="mt-6">
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={isProcessing || (!selectedFile && !directText && !url)}
            >
              {isProcessing ? "Procesando..." : "Procesar Contenido"}
            </Button>
          </div>
        </Tabs>
      </div>

      {uploadedContents.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Contenidos Cargados</h3>
          <div className="space-y-4">
            {uploadedContents.map((content) => (
              <Card 
                key={content.id} 
                className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{content.file_name || "Contenido sin nombre"}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(content.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentUpload;
