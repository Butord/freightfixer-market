
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Truck, Cog, Battery, Tool } from "lucide-react";

const CATEGORIES = [
  {
    id: 1,
    name: "Двигун та його системи",
    description: "Деталі двигуна, система охолодження, паливна система",
    icon: Cog,
    subcategories: ["Блок двигуна", "Головка блоку", "Поршнева група"],
    count: 245,
  },
  {
    id: 2,
    name: "Трансмісія",
    description: "Коробка передач, зчеплення, карданний вал",
    icon: Tool,
    subcategories: ["КПП", "Зчеплення", "Карданний вал"],
    count: 158,
  },
  {
    id: 3,
    name: "Ходова частина",
    description: "Підвіска, амортизатори, ресори, мости",
    icon: Truck,
    subcategories: ["Передня підвіска", "Задня підвіска", "Амортизатори"],
    count: 186,
  },
  {
    id: 4,
    name: "Електрообладнання",
    description: "Акумулятори, генератори, стартери, освітлення",
    icon: Battery,
    subcategories: ["Акумулятори", "Генератори", "Стартери"],
    count: 134,
  },
  {
    id: 5,
    name: "Гальмівна система",
    description: "Гальмівні колодки, диски, супорти, шланги",
    icon: Tool,
    subcategories: ["Передні гальма", "Задні гальма", "Гальмівні шланги"],
    count: 142,
  },
  {
    id: 6,
    name: "Кузовні деталі",
    description: "Кабіна, облицювання, дзеркала, скло",
    icon: Truck,
    subcategories: ["Кабіна", "Облицювання", "Скло"],
    count: 198,
  },
];

const Categories = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Каталог запчастин</h1>
        <p className="text-gray-600">
          Оберіть категорію запчастин для вашого вантажного автомобіля
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.id} to={`/category/${category.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {category.count} товарів
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {category.description}
                  </CardDescription>
                  <div className="space-y-1">
                    {category.subcategories.map((sub, index) => (
                      <p 
                        key={index} 
                        className="text-sm text-gray-600 hover:text-primary transition-colors"
                      >
                        {sub}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
