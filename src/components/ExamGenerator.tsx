
import { useState } from "react";
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

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Mock API call - navigate to demo exam
    setTimeout(() => {
      setIsGenerating(false);
      window.location.href = "/examen-demo";
    }, 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Generar Examen</h2>
      
      <div className="space-y-6">
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
          disabled={selectedTypes.length === 0 || isGenerating}
        >
          {isGenerating ? "Generando..." : "Generar Examen"}
        </Button>
      </div>
    </div>
  );
};

export default ExamGenerator;
