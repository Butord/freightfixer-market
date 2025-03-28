
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const FEATURED_CATEGORIES = [
  { id: 1, name: "Двигун", image: "/placeholder.svg" },
  { id: 2, name: "Трансмісія", image: "/placeholder.svg" },
  { id: 3, name: "Гальмівна система", image: "/placeholder.svg" },
  { id: 4, name: "Підвіска", image: "/placeholder.svg" },
];

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Гальмівні колодки",
    price: 2500,
    image: "/placeholder.svg",
    category: "Гальмівна система",
  },
  {
    id: 2,
    name: "Масляний фільтр",
    price: 500,
    image: "/placeholder.svg",
    category: "Двигун",
  },
  {
    id: 3,
    name: "Амортизатор",
    price: 3500,
    image: "/placeholder.svg",
    category: "Підвіска",
  },
  {
    id: 4,
    name: "Комплект зчеплення",
    price: 15000,
    image: "/placeholder.svg",
    category: "Трансмісія",
  },
];

const NEW_PRODUCTS = [
  {
    id: 5,
    name: "Світлодіодні фари",
    price: 7800,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&h=350&auto=format&fit=crop",
    category: "Освітлення",
    isNew: true,
  },
  {
    id: 6,
    name: "Сенсор ABS",
    price: 1200,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=350&auto=format&fit=crop",
    category: "Електроніка",
    isNew: true,
  },
  {
    id: 7,
    name: "Турбокомпресор",
    price: 22000,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=350&auto=format&fit=crop",
    category: "Двигун",
    isNew: true,
  },
  {
    id: 8,
    name: "Комплект ГРМ",
    price: 4500,
    image: "/placeholder.svg",
    category: "Двигун",
    isNew: true,
  },
];

const Home = () => {
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); // Зупиняємо стандартну дію посилання
    e.stopPropagation(); // Зупиняємо подальше поширення події
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    
    toast.success(`${product.name} додано в кошик`);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30">
          <img
            src="/placeholder.svg"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Якісні запчастини для вашої вантажівки
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Великий вибір оригінальних запчастин за найкращими цінами
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary-hover">
              Перейти до каталогу
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Популярні категорії</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_CATEGORIES.map((category) => (
            <Link key={category.id} to={`/category/${category.id}`}>
              <Card className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-center">{category.name}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* New Products Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Новинки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {NEW_PRODUCTS.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow h-full group">
              <div className="relative">
                <Link to={`/product/${product.id}`}>
                  <CardHeader>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
                    />
                  </CardHeader>
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Новинка
                  </span>
                </Link>
              </div>
              <CardContent>
                <Link to={`/product/${product.id}`}>
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                  <p className="text-lg font-semibold text-primary mt-2">
                    {product.price.toLocaleString()} грн
                  </p>
                </Link>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Додати в кошик
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Популярні товари</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow h-full">
              <Link to={`/product/${product.id}`}>
                <CardHeader>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
              </Link>
              <CardContent>
                <Link to={`/product/${product.id}`}>
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                  <p className="text-lg font-semibold text-primary mt-2">
                    {product.price.toLocaleString()} грн
                  </p>
                </Link>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Додати в кошик
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Швидка доставка</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Доставляємо по всій Україні через надійні служби доставки</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Гарантія якості</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Всі запчастини від перевірених виробників з гарантією</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Технічна підтримка</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Наші спеціалісти завжди готові допомогти з вибором</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
