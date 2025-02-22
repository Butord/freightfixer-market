
import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/stores/cartStore";

const DELIVERY_METHODS = {
  NOVA_POSHTA: "nova_poshta",
  UKRPOSHTA: "ukrposhta",
} as const;

const Cart = () => {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [deliveryMethod, setDeliveryMethod] = useState<string>("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");

  // Приклад даних для демонстрації
  const cities = [
    "Київ",
    "Львів",
    "Харків",
    "Одеса",
    "Дніпро",
  ];

  const departments = {
    [DELIVERY_METHODS.NOVA_POSHTA]: [
      "Відділення №1 - вул. Хрещатик, 22",
      "Відділення №2 - вул. Велика Васильківська, 112",
      "Відділення №3 - пр. Перемоги, 67",
    ],
    [DELIVERY_METHODS.UKRPOSHTA]: [
      "Відділення №1 - вул. Сагайдачного, 24",
      "Відділення №2 - вул. Володимирська, 51/53",
      "Відділення №3 - бул. Лесі Українки, 28",
    ],
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
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
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

        {/* Підсумок замовлення та доставка */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Спосіб доставки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select onValueChange={setDeliveryMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть перевізника" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DELIVERY_METHODS.NOVA_POSHTA}>
                      Нова Пошта
                    </SelectItem>
                    <SelectItem value={DELIVERY_METHODS.UKRPOSHTA}>
                      Укрпошта
                    </SelectItem>
                  </SelectContent>
                </Select>

                {deliveryMethod && (
                  <>
                    <Select onValueChange={setCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть місто" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {city && (
                      <Select onValueChange={setDepartment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть відділення" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments[deliveryMethod as keyof typeof departments].map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

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
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>До сплати:</span>
                  <span>{total.toLocaleString()} грн</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!deliveryMethod || !city || !department}
              >
                Оформити замовлення
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
