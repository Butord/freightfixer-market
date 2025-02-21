
import { useParams } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Category = () => {
  const { id } = useParams();

  // Тимчасові дані для демонстрації
  const category = {
    id: 1,
    name: "Гальмівна система",
    description: "Запчастини для гальмівної системи вантажних автомобілів"
  };

  const products = [
    {
      id: 1,
      name: "Гальмівні колодки передні",
      price: 2500,
      description: "Високоякісні гальмівні колодки для вантажних автомобілів",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Гальмівні диски передні",
      price: 3500,
      description: "Гальмівні диски з високоякісної сталі",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Гальмівні циліндри",
      price: 1800,
      description: "Гальмівні циліндри для вантажних автомобілів",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Гальмівні шланги",
      price: 500,
      description: "Гальмівні шланги підвищеної міцності",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Заголовок категорії */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
      </div>

      {/* Фільтри та сортування */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортування" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Спочатку нові</SelectItem>
              <SelectItem value="cheapest">Спочатку дешевші</SelectItem>
              <SelectItem value="expensive">Спочатку дорожчі</SelectItem>
              <SelectItem value="popular">По популярності</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <p className="text-gray-600">
          Знайдено товарів: {products.length}
        </p>
      </div>

      {/* Список товарів */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-4">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                />
              </Link>
            </CardHeader>
            <CardContent className="flex-grow">
              <Link to={`/product/${product.id}`}>
                <CardTitle className="text-lg mb-2 hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
              </Link>
              <CardDescription className="line-clamp-2">
                {product.description}
              </CardDescription>
              <p className="text-xl font-bold text-primary mt-4">
                {product.price.toLocaleString()} грн
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">
                Додати в кошик
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Category;
