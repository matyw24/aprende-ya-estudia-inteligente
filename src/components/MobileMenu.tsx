
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, BookText, FileText, X, Menu, User as UserIcon, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-foreground md:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Book className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">AprendeYa</h1>
            </Link>
            <button onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {user && (
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{user.email?.split('@')[0]}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</span>
              </div>
            </div>
          )}
          
          <nav className="flex flex-col space-y-5">
            <Link 
              to="/cargar" 
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <span>Cargar Contenido</span>
            </Link>
            <Link 
              to="/examenes" 
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              <BookText className="h-5 w-5" />
              <span>Exámenes</span>
            </Link>
            <Link 
              to="/resumenes" 
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              <Book className="h-5 w-5" />
              <span>Resúmenes</span>
            </Link>
            <Link 
              to="/examen-demo" 
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              <BookText className="h-5 w-5" />
              <span>Examen Demo</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/perfil" 
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setOpen(false)}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Mi Perfil</span>
                </Link>
                <button 
                  className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors py-2 text-left"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setOpen(false)}
              >
                <UserIcon className="h-5 w-5" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex justify-center space-x-4">
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
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
