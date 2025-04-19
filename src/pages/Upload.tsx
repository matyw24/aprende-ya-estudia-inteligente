
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentUpload from "@/components/ContentUpload";

const Upload = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Cargar Contenido</h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Sube tus documentos PDF, ingresa texto directamente o proporciona una URL para comenzar a generar exámenes y resúmenes inteligentes.
          </p>
          <ContentUpload />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;
