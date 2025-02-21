
import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Cart = () => {
  // Тимчасові дані для демонстрації
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Гальмівні колодки",
      price: 2500,
      quantity: 1,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Масляний фільтр",
      price: 500,
      quantity: 2,
      image: "/placeholder.svg",
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Ваш кошик порожній</h2>
        <p className="text-gray-600 mb-8">Додайте товари для оформлення замовлення</p>
        <Link to="/">
          <Button>Перейти до каталогу</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Кошик</h1>
      
      <div className="grid gap-6 md:grid-cols-[1fr,300px]">
        {/* Список товарів */}
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-primary font-semibold mt-1">
                      {item.price.toLocaleString()} грн
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Підсумок замовлення */}
        <Card>
          <CardHeader>
            <CardTitle>Підсумок замовлення</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Сума товарів:</span>
              <span>{total.toLocaleString()} грн</span>
            </div>
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span>За тарифами перевізника</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Оформити замовлення
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
