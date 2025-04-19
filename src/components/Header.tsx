
import { Book, BookText, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";

const Header = () => {
  return (
    <header className="w-full bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">AprendeYa</h1>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/cargar" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <FileText className="h-5 w-5" />
            <span>Cargar Contenido</span>
          </Link>
          <Link to="/examenes" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <BookText className="h-5 w-5" />
            <span>Exámenes</span>
          </Link>
          <Link to="/resumenes" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Book className="h-5 w-5" />
            <span>Resúmenes</span>
          </Link>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;
