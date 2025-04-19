
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Link as LinkIcon, File } from "lucide-react";

const ContentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [directText, setDirectText] = useState("");
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // This would be implemented with actual API integration
    console.log("Would upload:", selectedFile || directText || url);
    alert("¡Contenido cargado con éxito! (simulado)");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
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
              accept=".pdf"
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
          <Button onClick={handleUpload} className="w-full">
            Procesar Contenido
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default ContentUpload;
