
import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Users,
  Settings,
  LayoutDashboard,
  FolderTree,
  Phone,
  Mail,
  CreditCard,
  Bell,
  Store,
  Search,
  Globe,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Компоненти для різних сторінок адмін-панелі
const AdminDashboard = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Панель управління</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <h3 className="text-xl font-semibold">23</h3>
          <p className="text-xs text-muted-foreground">Нових замовлень</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-xl font-semibold">₴ 12,234</h3>
          <p className="text-xs text-muted-foreground">Дохід за сьогодні</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-xl font-semibold">12</h3>
          <p className="text-xs text-muted-foreground">Нових клієнтів</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-xl font-semibold">45</h3>
          <p className="text-xs text-muted-foreground">Завершених замовлень</p>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Останні замовлення</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
              <div>
                <p className="font-medium">Замовлення #12345</p>
                <p className="text-xs text-muted-foreground">Іван Петренко</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₴ 3,240</p>
                <p className="text-xs text-muted-foreground">Сьогодні, 11:23</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
              <div>
                <p className="font-medium">Замовлення #12344</p>
                <p className="text-xs text-muted-foreground">Марія Ковальчук</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₴ 1,540</p>
                <p className="text-xs text-muted-foreground">Сьогодні, 10:08</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
              <div>
                <p className="font-medium">Замовлення #12343</p>
                <p className="text-xs text-muted-foreground">Олексій Шевченко</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₴ 5,670</p>
                <p className="text-xs text-muted-foreground">Вчора, 18:45</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Статистика продажів</h3>
          <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
            <p className="text-muted-foreground">Графік продажів</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Замовлення</h2>
      <Card className="p-6">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Клієнт</th>
                <th scope="col" className="px-6 py-3">Дата</th>
                <th scope="col" className="px-6 py-3">Сума</th>
                <th scope="col" className="px-6 py-3">Статус</th>
                <th scope="col" className="px-6 py-3">Дії</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">#12345</td>
                <td className="px-6 py-4">Іван Петренко</td>
                <td className="px-6 py-4">22.04.2023 11:23</td>
                <td className="px-6 py-4">₴ 3,240</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    В обробці
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm">Деталі</Button>
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">#12344</td>
                <td className="px-6 py-4">Марія Ковальчук</td>
                <td className="px-6 py-4">22.04.2023 10:08</td>
                <td className="px-6 py-4">₴ 1,540</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Виконано
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm">Деталі</Button>
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">#12343</td>
                <td className="px-6 py-4">Олексій Шевченко</td>
                <td className="px-6 py-4">21.04.2023 18:45</td>
                <td className="px-6 py-4">₴ 5,670</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Відправлено
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm">Деталі</Button>
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">#12342</td>
                <td className="px-6 py-4">Надія Мельник</td>
                <td className="px-6 py-4">21.04.2023 14:12</td>
                <td className="px-6 py-4">₴ 2,860</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    Скасовано
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm">Деталі</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const AdminCustomers = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Клієнти</h2>
      <Card className="p-6">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Ім'я</th>
                <th scope="col" className="px-6 py-3">E-mail</th>
                <th scope="col" className="px-6 py-3">Телефон</th>
                <th scope="col" className="px-6 py-3">Замовлень</th>
                <th scope="col" className="px-6 py-3">Дії</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">#1</td>
                <td className="px-6 py-4">Іван Петренко</td>
                <td className="px-6 py-4">ivan@example.com</td>
                <td className="px-6 py-4">+380 50 123 4567</td>
                <td className="px-6 py-4">5</td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm">Профіль</Button>
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">#2</td>
                <td className="px-6 py-4">Марія Ковальчук</td>
                <td className="px-6 py-4">maria@example.com</td>
                <td className="px-6 py-4">+380 67 789 1234</td>
                <td className="px-6 py-4">3</td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm">Профіль</Button>
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">#3</td>
                <td className="px-6 py-4">Олексій Шевченко</td>
                <td className="px-6 py-4">alex@example.com</td>
                <td className="px-6 py-4">+380 63 456 7890</td>
                <td className="px-6 py-4">2</td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm">Профіль</Button>
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">#4</td>
                <td className="px-6 py-4">Надія Мельник</td>
                <td className="px-6 py-4">nadiia@example.com</td>
                <td className="px-6 py-4">+380 97 567 8901</td>
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm">Профіль</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const AdminSettings = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  const settingsSections = [
    {
      id: "store",
      title: "Інформація про магазин",
      icon: Store,
      description: "Основні налаштування магазину",
      settings: [
        { name: "Назва магазину", value: "Мій магазин", type: "text" },
        { name: "Адреса", value: "м. Київ, вул. Хрещатик 1", type: "text" },
        { name: "Телефон", value: "+380 44 123 4567", type: "text" },
        { name: "E-mail", value: "info@mystore.com", type: "email" },
        { name: "Валюта", value: "UAH", type: "select", options: ["UAH", "USD", "EUR"] },
        { name: "Країна", value: "Україна", type: "select", options: ["Україна", "Польща", "Німеччина", "США"] },
        { name: "Часовий пояс", value: "Europe/Kiev", type: "select