
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUploadedContent } from "@/hooks/useUploadedContent";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type QuestionOption = {
  text: string;
  correct?: boolean;
};

type QuestionData = {
  text: string;
  options?: QuestionOption[];
  correctAnswer?: number | string;
  explanation?: string;
  type: "multiple" | "truefalse" | "open";
};

function parseAIResponse(questionRaw: any): QuestionData {
  // Intentamos convertir el objeto recibido desde IA en un formato estructurado
  // El backend debe retornar siempre: text, options (si aplica), correctAnswer, explanation, type
  // Fallback para respuestas en forma de texto plano
  if (typeof questionRaw === "string") {
    return {
      text: questionRaw,
      type: "open",
    };
  }
  return {
    text: questionRaw.text || "",
    options: questionRaw.options,
    correctAnswer: questionRaw.correctAnswer,
    explanation: questionRaw.explanation,
    type: questionRaw.type || "open",
  };
}

const ExamQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const [specificTopic, setSpecificTopic] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const { uploadedContents, fetchUploadedContents, getContentById } = useUploadedContent();

  useEffect(() => {
    fetchUploadedContents();
  }, []);

  const handleGenerate = async () => {
    if (!selectedContentId) {
      toast.error("Por favor selecciona un contenido para generar la pregunta");
      return;
    }

    setIsGenerating(true);
    setShowAnswer(false);
    setSelectedOption(null);

    try {
      const selectedContent = getContentById(selectedContentId);
      if (!selectedContent) throw new Error("No se pudo encontrar el contenido seleccionado");

      // Esperamos que el backend devuelva una pregunta estructurada
      const { data, error } = await supabase.functions.invoke('process-content', {
        body: {
          content: selectedContent.content,
          action: "generateQuestion",
          params: {
            specificTopic: specificTopic || undefined,
            structured: true // indicamos que la respuesta debe ser estructurada, si el backend lo soporta
          }
        }
      });

      if (error) throw error;

      // Parseamos la pregunta sea texto plano o estructurada
      let qData: QuestionData;
      try {
        qData = parseAIResponse(data?.question);
      } catch {
        qData = { text: typeof data?.question === "string" ? data?.question : "Pregunta generada.", type: "open" };
      }
      setQuestionData(qData);
    } catch (error) {
      console.error('Error al generar pregunta:', error);
      toast.error("Error al generar la pregunta. Inténtalo de nuevo.");
      setQuestionData(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setShowAnswer(true);
  };

  const isCorrect =
    questionData &&
    questionData.options &&
    (Number(selectedOption) === questionData.correctAnswer ||
      selectedOption === questionData.correctAnswer);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Generador de Preguntas</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="content">Seleccionar Contenido</Label>
          <Select value={selectedContentId} onValueChange={setSelectedContentId}>
            <SelectTrigger id="content">
              <SelectValue placeholder="Selecciona el contenido para la pregunta" />
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
          <Label htmlFor="specific-topic">Tema Específico (Opcional)</Label>
          <Textarea
            id="specific-topic"
            placeholder="Por ejemplo: Capítulo 3, o un tema concreto del contenido..."
            value={specificTopic}
            onChange={(e) => setSpecificTopic(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleGenerate}
            className="flex-1"
            disabled={isGenerating || !selectedContentId}
          >
            {isGenerating ? "Generando..." : "Generar Pregunta"}
          </Button>
        </div>

        {questionData && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="mb-2 text-base font-medium">{questionData.text}</div>
              {questionData.type === "multiple" && questionData.options && (
                <RadioGroup
                  value={selectedOption !== null ? String(selectedOption) : undefined}
                  onValueChange={handleOptionChange}
                  className="space-y-2"
                >
                  {questionData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(idx)} id={`option-${idx}`} disabled={showAnswer}/>
                      <Label htmlFor={`option-${idx}`} className="cursor-pointer">
                        {opt.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {questionData.type === "truefalse" && (
                <RadioGroup
                  value={selectedOption !== null ? String(selectedOption) : undefined}
                  onValueChange={handleOptionChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="true" disabled={showAnswer}/>
                    <Label htmlFor="true" className="cursor-pointer">Verdadero</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="false" disabled={showAnswer}/>
                    <Label htmlFor="false" className="cursor-pointer">Falso</Label>
                  </div>
                </RadioGroup>
              )}
              {questionData.type === "open" && (
                <Textarea
                  disabled
                  value="Esta pregunta requiere revisión manual de la respuesta."
                  className="min-h-[60px] mt-2"
                />
              )}

              {showAnswer && (questionData.type === "multiple" || questionData.type === "truefalse") && (
                <div className="mt-4 p-3 rounded bg-muted-foreground/10">
                  <div className="font-semibold mb-1">
                    {isCorrect ? "¡Correcto! 🎉" : "Incorrecto 😢"}
                  </div>
                  {questionData.explanation && (
                    <div className="text-sm">{questionData.explanation}</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExamQuestionGenerator;
