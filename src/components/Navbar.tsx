
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";

const Navbar = () => {
  const cartItemsCount = useCartStore((state) => state.items.length);

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                  <SheetDescription>
                    Навігація по категоріях
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <Link to="/" className="block hover:text-primary">Головна</Link>
                  <Link to="/categories" className="block hover:text-primary">Категорії</Link>
                  <Link to="/about" className="block hover:text-primary">Про нас</Link>
                  <Link to="/contacts" className="block hover:text-primary">Контакти</Link>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="font-bold text-xl text-primary">
              TruckParts
            </Link>

            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/categories" className="hover:text-primary transition-colors">
                Категорії
              </Link>
              <Link to="/about" className="hover:text-primary transition-colors">
                Про нас
              </Link>
              <Link to="/contacts" className="hover:text-primary transition-colors">
                Контакти
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Пошук запчастин..."
                className="input-field pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
