
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import ExportPDF from "./ExportPDF";
import { toast } from "sonner";

const ExamExportButton = ({ title }: { title: string }) => {
  return <ExportPDF title={title} type="exam" />;
};

// Define proper types for different question formats
type MultipleChoiceQuestion = {
  id: number;
  type: "multiple";
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type TrueFalseQuestion = {
  id: number;
  type: "truefalse";
  text: string;
  correctAnswer: boolean;
  explanation: string;
};

type OpenQuestion = {
  id: number;
  type: "open";
  text: string;
  explanation: string;
};

type MatchingPair = {
  item: string;
  match: string;
};

type MatchingQuestion = {
  id: number;
  type: "matching";
  text: string;
  pairs: MatchingPair[];
  explanation: string;
};

type Question = MultipleChoiceQuestion | TrueFalseQuestion | OpenQuestion | MatchingQuestion;

type Exam = {
  title: string;
  questions: Question[];
};

// Default mock exam as fallback
const defaultExam: Exam = {
  title: "Examen de Muestra",
  questions: [
    {
      id: 1,
      type: "multiple",
      text: "¿Cuál de los siguientes NO es un organelo presente en células eucariotas?",
      options: [
        "Mitocondria",
        "Ribosoma",
        "Nucleoide",
        "Aparato de Golgi"
      ],
      correctAnswer: 2,
      explanation: "El nucleoide es una región del citoplasma que contiene el material genético en células procariotas, no en eucariotas."
    },
    {
      id: 2,
      type: "truefalse",
      text: "Las mitocondrias son conocidas como 'la central energética' de la célula porque producen ATP.",
      correctAnswer: true,
      explanation: "Las mitocondrias son responsables de la producción de ATP a través del proceso de respiración celular."
    }
  ]
};

const ExamPreview = () => {
  const [exam, setExam] = useState<Exam>(defaultExam);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [shuffledPairs, setShuffledPairs] = useState<string[]>([]);

  useEffect(() => {
    // Retrieve the generated exam from sessionStorage
    const storedExam = sessionStorage.getItem('generatedExam');
    
    if (storedExam) {
      try {
        const parsedExam = JSON.parse(storedExam);
        setExam(parsedExam);
        
        // Initialize shuffled pairs if matching questions exist
        if (parsedExam.questions) {
          const matchingQuestion = parsedExam.questions.find(q => q.type === "matching");
          if (matchingQuestion && 'pairs' in matchingQuestion) {
            setShuffledPairs([...matchingQuestion.pairs].sort(() => Math.random() - 0.5).map(p => p.match));
          }
        }
      } catch (error) {
        console.error("Error parsing stored exam:", error);
        toast.error("Error al cargar el examen generado.");
      }
    }
  }, []);

  const handleMultipleChoice = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleTrueFalse = (questionId: number, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleOpenAnswer = (questionId: number, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const handleMatching = (questionId: number, itemIndex: number, matchValue: string) => {
    const currentMatches = answers[questionId] || {};
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: { 
        ...currentMatches, 
        [itemIndex]: matchValue 
      } 
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{exam.title}</h2>
        {!showResults && (
          <span className="text-muted-foreground">
            {Object.keys(answers).length} de {exam.questions.length} respondidas
          </span>
        )}
      </div>
      
      {showResults && (
        <div className="mb-8 p-4 bg-accent rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Resultados del Examen</h3>
          <p className="text-lg">Completaste el examen. En una implementación real, aquí verías tu puntuación y retroalimentación detallada.</p>
        </div>
      )}
      
      <div className="space-y-10">
        {exam.questions.map((question) => (
          <Card key={question.id} className="border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Pregunta {question.id}
                </span>
                <span className="text-sm font-medium px-2 py-1 bg-secondary rounded-full">
                  {question.type === "multiple" ? "Opción Múltiple" : 
                   question.type === "truefalse" ? "Verdadero/Falso" : 
                   question.type === "open" ? "Respuesta Abierta" : "Relacionar Columnas"}
                </span>
              </div>
              
              <h3 className="text-lg font-medium mb-4">{question.text}</h3>
              
              {question.type === "multiple" && (
                <RadioGroup 
                  value={answers[question.id]?.toString()} 
                  onValueChange={(value) => handleMultipleChoice(question.id, parseInt(value))}
                  className="space-y-3"
                >
                  {question.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem value={idx.toString()} id={`q${question.id}-option${idx}`} />
                      <Label htmlFor={`q${question.id}-option${idx}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {question.type === "truefalse" && (
                <RadioGroup 
                  value={answers[question.id]?.toString()} 
                  onValueChange={(value) => handleTrueFalse(question.id, value === "true")}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`q${question.id}-true`} />
                    <Label htmlFor={`q${question.id}-true`} className="cursor-pointer">Verdadero</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`q${question.id}-false`} />
                    <Label htmlFor={`q${question.id}-false`} className="cursor-pointer">Falso</Label>
                  </div>
                </RadioGroup>
              )}
              
              {question.type === "open" && (
                <Textarea
                  placeholder="Escribe tu respuesta aquí..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleOpenAnswer(question.id, e.target.value)}
                  className="min-h-[120px]"
                />
              )}
              
              {question.type === "matching" && 'pairs' in question && (
                <div className="space-y-4">
                  {question.pairs.map((pair, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center">
                      <div className="font-medium min-w-[180px] mb-2 sm:mb-0">{pair.item}</div>
                      <select
                        className="border rounded px-3 py-2 bg-background"
                        value={answers[question.id]?.[idx] || ""}
                        onChange={(e) => handleMatching(question.id, idx, e.target.value)}
                      >
                        <option value="">Seleccionar...</option>
                        {shuffledPairs.map((match, matchIdx) => (
                          <option key={matchIdx} value={match}>
                            {match}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
              
              {showResults && question.explanation && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="font-semibold mb-1">Explicación:</p>
                  <p>{question.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 flex justify-end space-x-4">
        {!showResults ? (
          <Button onClick={handleSubmit}>Finalizar y Revisar</Button>
        ) : (
          <div className="flex space-x-4">
            <Button onClick={() => setShowResults(false)} variant="outline">
              Volver al Examen
            </Button>
            <div className="flex-1"></div>
            <ExamExportButton title={exam.title} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPreview;
