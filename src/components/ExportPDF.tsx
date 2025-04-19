
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText } from "lucide-react";

interface ExportPDFProps {
  title?: string;
  type?: "exam" | "summary";
}

const ExportPDF = ({ title = "Documento", type = "exam" }: ExportPDFProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [fileName, setFileName] = useState(title);

  const handleExport = () => {
    setIsExporting(true);
    // Mock export functionality
    setTimeout(() => {
      setIsExporting(false);
      alert(`¡${type === "exam" ? "Examen" : "Resumen"} exportado como ${fileName}.pdf! (simulado)`);
    }, 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Exportar a PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar a PDF</DialogTitle>
          <DialogDescription>
            Configura las opciones de exportación para tu {type === "exam" ? "examen" : "resumen"}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file-name">Nombre del archivo</Label>
            <Input
              id="file-name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          
          {type === "exam" && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-answers"
                  checked={includeAnswers}
                  onCheckedChange={(checked) => setIncludeAnswers(checked as boolean)}
                />
                <Label htmlFor="include-answers">Incluir respuestas</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-explanations"
                  checked={includeExplanations}
                  onCheckedChange={(checked) => setIncludeExplanations(checked as boolean)}
                />
                <Label htmlFor="include-explanations">Incluir explicaciones</Label>
              </div>
            </>
          )}
          
          {type === "summary" && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="include-toc" defaultChecked />
                <Label htmlFor="include-toc">Incluir tabla de contenidos</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="include-page-numbers" defaultChecked />
                <Label htmlFor="include-page-numbers">Incluir números de página</Label>
              </div>
            </div>
          )}
        </div>
        
        <Button onClick={handleExport} disabled={isExporting}>
          {isExporting ? "Exportando..." : "Exportar"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPDF;
