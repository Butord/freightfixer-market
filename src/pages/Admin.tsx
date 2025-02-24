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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Всього товарів",
      value: "156",
      description: "+12% з минулого місяця",
      trend: "up",
    },
    {
      title: "Активні замовлення",
      value: "23",
      description: "4 очікують підтвердження",
      trend: "neutral",
    },
    {
      title: "Дохід за місяць",
      value: "45,231₴",
      description: "+23% з минулого місяця",
      trend: "up",
    },
    {
      title: "Клієнти",
      value: "573",
      description: "+8 нових за тиждень",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Панель керування</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-lg border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-2xl font-bold">{stat.value}</div>
              <span className={cn(
                "text-xs",
                stat.trend === "up" ? "text-green-500" : 
                stat.trend === "down" ? "text-red-500" : 
                "text-gray-500"
              )}>
                {stat.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-6">
              <h3 className="text-lg font-medium">Останні замовлення</h3>
              <Button variant="ghost">Переглянути всі</Button>
            </div>
            <div className="p-6 pt-0">
              <div className="text-muted-foreground">
                Завантаження даних...
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-6">
              <h3 className="text-lg font-medium">Популярні товари</h3>
              <Button variant="ghost">Детальніше</Button>
            </div>
            <div className="p-6 pt-0">
              <div className="text-muted-foreground">
                Завантаження даних...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    customer: string;
    date: string;
    total: string;
    status: string;
    items?: Array<{
      id: number;
      name: string;
      quantity: number;
      price: string;
    }>;
    shipping?: {
      method: string;
      address: string;
      tracking?: string;
    };
    payment?: {
      method: string;
      status: string;
    };
  } | null>(null);

  const orders = [
    {
      id: "ORD001",
      customer: "Іван Петренко",
      date: "2024-02-24",
      total: "2,450₴",
      status: "pending",
      items: [
        { id: 1, name: "Смартфон Samsung Galaxy A54", quantity: 1, price: "1,999₴" },
        { id: 2, name: "Захисне скло", quantity: 2, price: "225.50₴" },
      ],
      shipping: {
        method: "Нова Пошта",
        address: "м. Київ, відділення №23",
        tracking: "20450111111111",
      },
      payment: {
        method: "Карта Visa/Mastercard",
        status: "Оплачено",
      },
    },
    {
      id: "ORD002",
      customer: "Марія Коваленко",
      date: "2024-02-23",
      total: "1,280₴",
      status: "completed",
      items: [
        { id: 3, name: "Навушники Apple AirPods", quantity: 1, price: "1,280₴" },
      ],
      shipping: {
        method: "Укрпошта",
        address: "м. Львів, вул. Франка 25",
      },
      payment: {
        method: "При отриманні",
        status: "Очікує оплати",
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Замовлення</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Пошук замовлень..." className="pl-8" />
          </div>
          <Button>Фільтрувати</Button>
        </div>
      </div>

      <Card>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Клієнт</th>
                <th className="px-6 py-3">Дата</th>
                <th className="px-6 py-3">Сума</th>
                <th className="px-6 py-3">Статус</th>
                <th className="px-6 py-3">Дії</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      order.status === "completed" ? "bg-green-100 text-green-800" : 
                      "bg-yellow-100 text-yellow-800"
                    )}>
                      {order.status === "completed" ? "Виконано" : "Очікує"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Деталі
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Деталі замовлення {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Інформація про клієнта</h3>
                <p className="text-sm">{selectedOrder?.customer}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Товари</h3>
                <div className="space-y-2">
                  {selectedOrder?.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Кількість: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">{item.price}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 font-bold">
                    <p>Всього</p>
                    <p>{selectedOrder?.total}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Доставка</h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Спосіб доставки:</span>{" "}
                    {selectedOrder?.shipping?.method}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Адреса:</span>{" "}
                    {selectedOrder?.shipping?.address}
                  </p>
                  {selectedOrder?.shipping?.tracking && (
                    <p className="text-sm">
                      <span className="font-medium">ТТН:</span>{" "}
                      {selectedOrder.shipping.tracking}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Оплата</h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Спосіб оплати:</span>{" "}
                    {selectedOrder?.payment?.method}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Статус:</span>{" "}
                    {selectedOrder?.payment?.status}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AdminCustomers = () => {
  const customers = [
    {
      name: "Іван Петренко",
      email: "ivan@example.com",
      phone: "+380501234567",
      orders: 5,
      spent: "12,450₴",
    },
    {
      name: "Марія Коваленко",
      email: "maria@example.com",
      phone: "+380671234567",
      orders: 3,
      spent: "8,280₴",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Клієнти</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Пошук клієнтів..." className="pl-8" />
          </div>
          <Button>Експорт</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm font-medium text-muted-foreground">
              Всього клієнтів
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold">573</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm font-medium text-muted-foreground">
              Всього замовлень
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold">1,234</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm font-medium text-muted-foreground">
              Середній чек
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold">2,450₴</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm font-medium text-muted-foreground">
              Нові за місяць
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold">+48</div>
        </Card>
      </div>

      <Card>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th className="px-6 py-3">Клієнт</th>
                <th className="px-6 py-3">Контакти</th>
                <th className="px-6 py-3">Замовлення</th>
                <th className="px-6 py-3">Витрачено</th>
                <th className="px-6 py-3">Дії</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.email} className="border-b">
                  <td className="px-6 py-4 font-medium">{customer.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{customer.orders}</td>
                  <td className="px-6 py-4">{customer.spent}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">Деталі</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const AdminSettings = () => {
  const settingsSections = [
    {
      title: "Магазин",
      icon: Store,
      description: "Налаштування магазину, валюта, локалізація",
      settings: [
        { name: "Назва магазину", value: "Мій магазин" },
        { name: "Валюта", value: "UAH" },
        { name: "Мова", value: "Українська" },
      ]
    },
    {
      title: "Сповіщення",
      icon: Bell,
      description: "Налаштування email та SMS сповіщень",
      settings: [
        { name: "Email сповіщення", value: "Увімкнено" },
        { name: "SMS сповіщення", value: "Вимкнено" },
        { name: "Push сповіщення", value: "Увімкнено" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Налаштування</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => (
          <Card key={section.title} className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <section.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{section.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {section.description}
                </p>
                <div className="mt-4 space-y-3">
                  {section.settings.map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between">
                      <span className="text-sm">{setting.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {setting.value}
                      </span>
                    </div>
                  ))}
                </div>
                <Button className="mt-4" variant="outline">
                  Змінити налаштування
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Admin = () => {
  const location = useLocation();

  const navigation = [
    { name: "Панель керування", path: "/admin", icon: LayoutDashboard },
    { name: "Товари", path: "/admin/products", icon: Package },
    { name: "Категорії", path: "/admin/categories", icon: FolderTree },
    { name: "Замовлення", path: "/admin/orders", icon: ShoppingCart },
    { name: "Клієнти", path: "/admin/customers", icon: Users },
    { name: "Налаштування", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Керування магазином
          </p>
        </div>
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Admin;
