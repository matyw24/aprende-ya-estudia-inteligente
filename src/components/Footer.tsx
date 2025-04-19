
import { Link } from "react-router-dom";
import { Book } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-secondary py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <Book className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-primary">AprendeYa</h2>
            </Link>
            <p className="text-sm text-muted-foreground">
              Estudia de manera inteligente y eficiente con la ayuda de IA.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/cargar" className="text-muted-foreground hover:text-primary transition-colors">
                  Cargar Contenido
                </Link>
              </li>
              <li>
                <Link to="/examenes" className="text-muted-foreground hover:text-primary transition-colors">
                  Generador de Exámenes
                </Link>
              </li>
              <li>
                <Link to="/resumenes" className="text-muted-foreground hover:text-primary transition-colors">
                  Editor de Resúmenes
                </Link>
              </li>
              <li>
                <Link to="/examen-demo" className="text-muted-foreground hover:text-primary transition-colors">
                  Demo
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Guía de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Tutoriales
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@aprendeya.com" className="text-muted-foreground hover:text-primary transition-colors">
                  info@aprendeya.com
                </a>
              </li>
              <li className="flex space-x-4 mt-3">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} AprendeYa. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
