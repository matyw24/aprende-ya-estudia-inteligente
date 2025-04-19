
import { Book, BookText, FileText, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const { user, signOut, isLoading } = useAuth();

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
          
          {isLoading ? (
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="flex items-center gap-2 cursor-pointer">
                    <UserIcon className="h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                <span>Iniciar Sesión</span>
              </Button>
            </Link>
          )}
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;
