
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Package, Truck, Shield } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const Product = () => {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addItem);

  // Тимчасові дані для демонстрації
  const product = {
    id: Number(id),
    name: "Гальмівні колодки",
    price: 2500,
    description: "Високоякісні гальмівні колодки для вантажних автомобілів",
    specifications: [
      "Матеріал: Керамічний композит",
      "Термостійкість: до 800°C",
      "Довговічність: 100,000 км",
    ],
    details: [
      "Підвищена зносостійкість",
      "Низький рівень шуму",
      "Стабільна ефективність гальмування",
      "Мінімальне зношування дисків",
    ],
    compatibility: [
      "DAF XF 105",
      "Mercedes-Benz Actros",
      "MAN TGX",
      "Volvo FH",
    ],
    image: "/placeholder.svg",
    stock: 15,
    warranty: "12 місяців",
    delivery: "2-3 дні",
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
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
            
            {/* Статус наявності */}
            <div className="flex items-center gap-2 text-green-600">
              <Package className="h-5 w-5" />
              <span>В наявності: {product.stock} шт.</span>
            </div>

            {/* Доставка та гарантія */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Доставка</p>
                  <p className="text-sm text-gray-600">{product.delivery}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Гарантія</p>
                  <p className="text-sm text-gray-600">{product.warranty}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button className="flex-1" size="lg" onClick={handleAddToCart}>
              Додати в кошик
            </Button>
            <Button variant="outline" size="lg">
              Купити зараз
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Додаткова інформація */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <Tabs defaultValue="specifications">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="specifications">Характеристики</TabsTrigger>
              <TabsTrigger value="details">Опис</TabsTrigger>
              <TabsTrigger value="compatibility">Сумісність</TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="mt-4">
              <ul className="list-disc list-inside space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="text-gray-600">{spec}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <ul className="list-disc list-inside space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="text-gray-600">{detail}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="compatibility" className="mt-4">
              <ul className="list-disc list-inside space-y-2">
                {product.compatibility.map((item, index) => (
                  <li key={index} className="text-gray-600">{item}</li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Product;
