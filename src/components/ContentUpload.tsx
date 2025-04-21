
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Link as LinkIcon, File, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUploadedContent } from "@/hooks/useUploadedContent";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

const ContentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [directText, setDirectText] = useState("");
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveContent, uploadedContents, fetchUploadedContents, deleteContent } = useUploadedContent();

  useEffect(() => {
    fetchUploadedContents();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Read file content based on file type
      if (file.type === 'application/pdf') {
        readPdfFile(file);
      } else {
        readTextFile(file);
      }
    }
  };

  const readTextFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
    };
    reader.readAsText(file);
  };

  const readPdfFile = async (file: File) => {
    try {
      setIsProcessing(true);
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append('pdf', file);
      
      // Extract text from PDF using the Supabase function
      const { data, error } = await supabase.functions.invoke('process-content', {
        body: { action: "extractPdfText", fileName: file.name }
      });
      
      if (error) throw error;
      
      if (data && data.text) {
        setFileContent(data.text);
      } else {
        throw new Error("No se pudo extraer el texto del PDF");
      }
    } catch (error) {
      console.error('Error al procesar PDF:', error);
      toast.error("Error al procesar el archivo PDF. Intenta con un archivo de texto plano.");
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchUrlContent = async (urlToFetch: string) => {
    try {
      setIsProcessing(true);
      
      // Use the Supabase function to fetch the URL content securely
      const { data, error } = await supabase.functions.invoke('process-content', {
        body: { action: "fetchUrl", url: urlToFetch }
      });
      
      if (error) throw error;
      
      if (data && data.content) {
        return data.content;
      } else {
        throw new Error("No se pudo obtener el contenido de la URL");
      }
    } catch (error) {
      console.error('Error al obtener contenido de URL:', error);
      toast.error("Error al obtener contenido de la URL");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const processContent = async (content: string, fileName?: string) => {
    setIsProcessing(true);
    try {
      const savedContent = await saveContent(content, "", fileName);
      
      if (savedContent) {
        toast.success("Contenido procesado exitosamente");
        setDirectText("");
        setUrl("");
        setSelectedFile(null);
        setFileContent("");
      }
    } catch (error) {
      console.error('Error al procesar:', error);
      toast.error("Error al procesar el contenido");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && fileContent) {
      await processContent(fileContent, selectedFile.name);
    } else if (directText) {
      await processContent(directText);
    } else if (url) {
      const content = await fetchUrlContent(url);
      if (content) {
        await processContent(content, url);
      }
    }
  };

  const PreviewDialog = ({ content }: { content: { title: string; content: string } }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" title="Previsualizar">
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 whitespace-pre-wrap font-mono text-sm">
          {content.content}
        </div>
      </DialogContent>
    </Dialog>
  );

  // Componente para borrar con confirmación
  const DeleteDialog = ({ id, title }: { id: string | undefined, title: string }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-destructive" title="Eliminar">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar contenido?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar "<span className="font-semibold">{title}</span>"? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
            onClick={() => deleteContent(id)}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

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
            {fileContent && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">Vista previa del contenido:</p>
                <div className="max-h-[200px] overflow-y-auto bg-muted p-3 rounded text-sm font-mono">
                  {fileContent.slice(0, 500)}
                  {fileContent.length > 500 && "..."}
                </div>
              </div>
            )}
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
              disabled={isProcessing || (!fileContent && !directText && !url)}
            >
              {isProcessing ? "Procesando..." : "Procesar Contenido"}
            </Button>
          </div>
        </Tabs>
      </div>

      {uploadedContents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Contenidos Cargados</h3>
          <div className="space-y-4">
            {uploadedContents.map((content) => (
              <Card key={content.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium">{content.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(content.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PreviewDialog content={content} />
                    <DeleteDialog id={content.id} title={content.title || "Sin título"} />
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
