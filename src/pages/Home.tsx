
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

const Home = () => {
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

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Популярні товари</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                  <p className="text-lg font-semibold text-primary mt-2">
                    {product.price.toLocaleString()} грн
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Додати в кошик</Button>
                </CardFooter>
              </Card>
            </Link>
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
