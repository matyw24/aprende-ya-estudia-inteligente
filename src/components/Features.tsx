
import { BookText, FileText, Book } from "lucide-react";

const features = [
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Carga Tu Contenido",
    description: "Sube PDFs, textos o URLs y deja que nuestra IA procese la información."
  },
  {
    icon: <BookText className="h-10 w-10 text-primary" />,
    title: "Genera Exámenes",
    description: "Crea pruebas personalizadas con múltiples formatos de preguntas para evaluar tu conocimiento."
  },
  {
    icon: <Book className="h-10 w-10 text-primary" />,
    title: "Crea Resúmenes",
    description: "Obtén resúmenes estructurados que te ayuden a comprender y retener mejor el material."
  }
];

const Features = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="como-funciona">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Cómo Funciona
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Una plataforma diseñada para optimizar tu estudio universitario
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
