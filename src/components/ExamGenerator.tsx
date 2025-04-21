
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUploadedContent } from "@/hooks/useUploadedContent";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const questionTypes = [
  { id: "multiple", label: "Opción Múltiple" },
  { id: "open", label: "Respuesta Abierta" },
  { id: "truefalse", label: "Verdadero/Falso" },
  { id: "matching", label: "Relacionar Columnas" }
];

const ExamGenerator = () => {
  const [difficulty, setDifficulty] = useState("medio");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["multiple"]);
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const { uploadedContents, fetchUploadedContents, getContentById } = useUploadedContent();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUploadedContents();
  }, []);

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleGenerate = async () => {
    if (!selectedContentId) {
      toast.error("Por favor selecciona un contenido para generar el examen");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const selectedContent = getContentById(selectedContentId);
      
      if (!selectedContent) {
        throw new Error("No se pudo encontrar el contenido seleccionado");
      }
      
      const { data, error } = await supabase.functions.invoke('process-content', {
        body: { 
          content: selectedContent.content,
          action: "generateExam",
          params: {
            difficulty,
            questionTypes: selectedTypes,
            questionCount
          }
        }
      });
      
      if (error) throw error;
      
      // Store the generated exam in sessionStorage to retrieve it in the demo page
      sessionStorage.setItem('generatedExam', JSON.stringify(data.exam));
      
      setIsGenerating(false);
      navigate("/examen-demo");
      
    } catch (error) {
      console.error('Error al generar examen:', error);
      toast.error("Error al generar el examen. Inténtalo de nuevo.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Generar Examen</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="content">Seleccionar Contenido</Label>
          <Select value={selectedContentId} onValueChange={setSelectedContentId}>
            <SelectTrigger id="content">
              <SelectValue placeholder="Selecciona el contenido para el examen" />
            </SelectTrigger>
            <SelectContent>
              {uploadedContents.map((content) => (
                <SelectItem key={content.id} value={content.id || ""}>
                  {content.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {uploadedContents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay contenido disponible. Por favor, carga algún contenido primero en la sección "Cargar Contenido".
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Nivel de Dificultad</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Selecciona la dificultad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bajo">Bajo</SelectItem>
              <SelectItem value="medio">Medio</SelectItem>
              <SelectItem value="alto">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Tipos de Preguntas</Label>
          <div className="grid grid-cols-2 gap-4">
            {questionTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={type.id} 
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => handleTypeToggle(type.id)}
                />
                <Label htmlFor={type.id} className="cursor-pointer">{type.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="question-count">Número de Preguntas: {questionCount}</Label>
          <input
            id="question-count"
            type="range"
            min="5"
            max="30"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          className="w-full" 
          disabled={selectedTypes.length === 0 || isGenerating || !selectedContentId}
        >
          {isGenerating ? "Generando..." : "Generar Examen"}
        </Button>
      </div>
    </div>
  );
};

export default ExamGenerator;
