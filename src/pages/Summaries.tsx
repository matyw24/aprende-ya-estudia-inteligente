
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SummaryEditor from "@/components/SummaryEditor";

const Summaries = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Editor de Resúmenes</h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Crea resúmenes estructurados fácilmente con nuestro editor intuitivo y asistente de IA.
          </p>
          <SummaryEditor />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Summaries;
