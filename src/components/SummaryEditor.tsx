
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ExportPDF from "./ExportPDF";

const SummaryEditor = () => {
  const [content, setContent] = useState("");

  // Mock function to get AI suggestions
  const getAISuggestion = () => {
    const suggestions = [
      "El proceso de fotosíntesis consiste en la conversión de energía lumínica en energía química.",
      "Las células eucariotas se caracterizan por tener un núcleo definido y organelos membranosos.",
      "La teoría de la relatividad especial, propuesta por Einstein en 1905, revolucionó la física clásica."
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const handleSuggestion = () => {
    const suggestion = getAISuggestion();
    setContent(prev => prev + (prev ? "\n\n" : "") + suggestion);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Editor de Resumen</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">T1</Button>
              <Button variant="outline" size="sm">T2</Button>
              <Button variant="outline" size="sm">B</Button>
              <Button variant="outline" size="sm">I</Button>
              <Button variant="outline" size="sm">•</Button>
            </div>
            <Button onClick={handleSuggestion} size="sm">
              Sugerencia IA
            </Button>
          </div>
          
          <div className="min-h-[400px] border rounded-md p-4 bg-white">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu resumen aquí..."
              className="w-full h-full min-h-[380px] resize-none border-none focus:outline-none"
            />
          </div>
        </div>
        
        <div className="md:w-64">
          <div className="bg-secondary p-4 rounded-md">
            <h3 className="font-medium mb-2">Sugerencias</h3>
            <div className="space-y-2">
              <Button variant="ghost" onClick={handleSuggestion} className="w-full justify-start text-left">
                Añadir introducción
              </Button>
              <Button variant="ghost" onClick={handleSuggestion} className="w-full justify-start text-left">
                Explicar concepto clave
              </Button>
              <Button variant="ghost" onClick={handleSuggestion} className="w-full justify-start text-left">
                Añadir conclusión
              </Button>
              <Button variant="ghost" onClick={handleSuggestion} className="w-full justify-start text-left">
                Ampliar último punto
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <ExportPDF title="Mi Resumen" type="summary" />
      </div>
    </div>
  );
};

export default SummaryEditor;
