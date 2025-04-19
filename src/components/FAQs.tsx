
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo funciona el generador de exámenes?",
    answer: "El generador de exámenes utiliza tecnología de IA para analizar el contenido que has cargado y generar preguntas relevantes en diferentes formatos: opción múltiple, verdadero/falso, respuesta abierta y relacionar columnas. Puedes personalizar la dificultad y el número de preguntas según tus necesidades."
  },
  {
    question: "¿Es seguro subir mis documentos de estudio?",
    answer: "Sí, todos los documentos se procesan de forma segura. En la versión actual sin cuenta de usuario, tus documentos se almacenan temporalmente y se eliminan después de la sesión. Nos tomamos muy en serio la privacidad y seguridad de tus datos."
  },
  {
    question: "¿Qué tipos de documentos puedo cargar?",
    answer: "Actualmente, puedes cargar archivos PDF, ingresar texto directamente o proporcionar URLs de sitios web académicos. Estamos trabajando para ampliar los formatos soportados en futuras actualizaciones."
  },
  {
    question: "¿Cómo se evalúan las respuestas abiertas?",
    answer: "Las respuestas abiertas se evalúan mediante un análisis semántico que busca palabras clave y conceptos importantes en tu respuesta. El sistema puede identificar si has comprendido los conceptos fundamentales, incluso si utilizas una redacción diferente."
  },
  {
    question: "¿Puedo guardar mis exámenes generados?",
    answer: "En la versión actual, puedes exportar tus exámenes y resúmenes como archivos PDF. Estamos trabajando en implementar un sistema de cuentas que permitirá guardar permanentemente tus materiales generados."
  }
];

const FAQs = () => {
  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Preguntas Frecuentes
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Respuestas a las dudas más comunes sobre AprendeYa.
          </p>
        </div>
        
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
