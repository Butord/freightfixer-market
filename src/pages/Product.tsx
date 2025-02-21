
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Product = () => {
  const { id } = useParams();

  // Тимчасові дані для демонстрації
  const product = {
    name: "Гальмівні колодки",
    price: 2500,
    description: "Високоякісні гальмівні колодки для вантажних автомобілів",
    specifications: [
      "Матеріал: Керамічний композит",
      "Термостійкість: до 800°C",
      "Довговічність: 100,000 км",
    ],
    image: "/placeholder.svg",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Зображення продукту */}
        <Card>
          <CardContent className="p-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Інформація про продукт */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <CardDescription>Артикул: {id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold text-primary">
              {product.price.toLocaleString()} грн
            </p>
            <p className="text-gray-600">{product.description}</p>
            
            <div>
              <h3 className="font-semibold mb-2">Характеристики:</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="text-gray-600">{spec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button className="flex-1" size="lg">
              Додати в кошик
            </Button>
            <Button variant="outline" size="lg">
              Купити зараз
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Product;
