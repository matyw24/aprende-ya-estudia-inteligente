
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUploadedContent } from "@/hooks/useUploadedContent";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X } from "lucide-react";

type QuestionOption = {
  text: string;
  correct?: boolean;
};

type QuestionData = {
  text: string;
  options?: QuestionOption[];
  correctAnswer?: number | string | boolean;
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
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
    setHasSubmitted(false);

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
    if (!hasSubmitted) {
      setSelectedOption(value);
    }
  };

  const handleSubmitAnswer = () => {
    setHasSubmitted(true);
    setShowAnswer(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setHasSubmitted(false);
  };

  const handleNewQuestion = () => {
    handleReset();
    handleGenerate();
  };

  // Utility function to check if an option is the correct answer for true/false questions
  const isTrueFalseCorrect = (option: string, correctAnswer: number | string | boolean | undefined): boolean => {
    if (option === "1" && (correctAnswer === 1 || correctAnswer === "1" || correctAnswer === true)) {
      return true;
    }
    if (option === "0" && (correctAnswer === 0 || correctAnswer === "0" || correctAnswer === false)) {
      return true;
    }
    return false;
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
              <div className="mb-4 text-base font-medium">{questionData.text}</div>
              
              {questionData.type === "multiple" && questionData.options && (
                <RadioGroup
                  value={selectedOption !== null ? String(selectedOption) : undefined}
                  onValueChange={handleOptionChange}
                  className="space-y-3"
                >
                  {questionData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={String(idx)} 
                        id={`option-${idx}`} 
                        disabled={hasSubmitted}
                        className={hasSubmitted ? 
                          (Number(idx) === questionData.correctAnswer ? "border-green-500" : 
                           (selectedOption === String(idx) ? "border-red-500" : "")) : ""}
                      />
                      <Label 
                        htmlFor={`option-${idx}`} 
                        className={`cursor-pointer ${hasSubmitted ? 
                          (Number(idx) === questionData.correctAnswer ? "text-green-600 font-medium" : 
                           (selectedOption === String(idx) && Number(idx) !== questionData.correctAnswer ? "text-red-600" : "")) : ""}`}
                      >
                        {opt.text}
                        {hasSubmitted && Number(idx) === questionData.correctAnswer && (
                          <Check className="inline-block ml-2 h-4 w-4 text-green-500" />
                        )}
                        {hasSubmitted && selectedOption === String(idx) && Number(idx) !== questionData.correctAnswer && (
                          <X className="inline-block ml-2 h-4 w-4 text-red-500" />
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {questionData.type === "truefalse" && (
                <RadioGroup
                  value={selectedOption !== null ? String(selectedOption) : undefined}
                  onValueChange={handleOptionChange}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="1" 
                      id="true" 
                      disabled={hasSubmitted}
                      className={hasSubmitted ? 
                        (isTrueFalseCorrect("1", questionData.correctAnswer) ? "border-green-500" : 
                         (selectedOption === "1" ? "border-red-500" : "")) : ""}
                    />
                    <Label 
                      htmlFor="true" 
                      className={`cursor-pointer ${hasSubmitted ? 
                        (isTrueFalseCorrect("1", questionData.correctAnswer) ? "text-green-600 font-medium" : 
                         (selectedOption === "1" && !isTrueFalseCorrect("1", questionData.correctAnswer) ? "text-red-600" : "")) : ""}`}
                    >
                      Verdadero
                      {hasSubmitted && isTrueFalseCorrect("1", questionData.correctAnswer) && (
                        <Check className="inline-block ml-2 h-4 w-4 text-green-500" />
                      )}
                      {hasSubmitted && selectedOption === "1" && 
                        !isTrueFalseCorrect("1", questionData.correctAnswer) && (
                        <X className="inline-block ml-2 h-4 w-4 text-red-500" />
                      )}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="0" 
                      id="false" 
                      disabled={hasSubmitted}
                      className={hasSubmitted ? 
                        (isTrueFalseCorrect("0", questionData.correctAnswer) ? "border-green-500" : 
                         (selectedOption === "0" ? "border-red-500" : "")) : ""}
                    />
                    <Label 
                      htmlFor="false" 
                      className={`cursor-pointer ${hasSubmitted ? 
                        (isTrueFalseCorrect("0", questionData.correctAnswer) ? "text-green-600 font-medium" : 
                         (selectedOption === "0" && !isTrueFalseCorrect("0", questionData.correctAnswer) ? "text-red-600" : "")) : ""}`}
                    >
                      Falso
                      {hasSubmitted && isTrueFalseCorrect("0", questionData.correctAnswer) && (
                        <Check className="inline-block ml-2 h-4 w-4 text-green-500" />
                      )}
                      {hasSubmitted && selectedOption === "0" && 
                        !isTrueFalseCorrect("0", questionData.correctAnswer) && (
                        <X className="inline-block ml-2 h-4 w-4 text-red-500" />
                      )}
                    </Label>
                  </div>
                </RadioGroup>
              )}
              
              {questionData.type === "open" && (
                <Textarea
                  placeholder="Esta pregunta requiere revisión manual de la respuesta."
                  className="min-h-[100px] mt-2"
                  disabled={hasSubmitted}
                />
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
              {!hasSubmitted && selectedOption !== null && (
                <Button onClick={handleSubmitAnswer} className="w-full">
                  Comprobar Respuesta
                </Button>
              )}
              
              {showAnswer && (
                <div className={`mt-4 p-4 rounded-md ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <div className={`font-semibold mb-2 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                    {isCorrect ? "¡Correcto! 🎉" : "Incorrecto 😢"}
                  </div>
                  {questionData.explanation && (
                    <div className="text-sm">{questionData.explanation}</div>
                  )}
                </div>
              )}
              
              {hasSubmitted && (
                <div className="flex gap-4 w-full">
                  <Button onClick={handleReset} variant="outline" className="flex-1">
                    Intentar de Nuevo
                  </Button>
                  <Button onClick={handleNewQuestion} className="flex-1">
                    Nueva Pregunta
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExamQuestionGenerator;
