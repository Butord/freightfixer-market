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
                Завант��ження даних...
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
  const [selectedCustomer, setSelectedCustomer] = useState<{
    name: string;
    email: string;
    phone: string;
    orders: number;
    spent: string;
    address?: string;
    registrationDate?: string;
    lastOrder?: string;
    orderHistory?: Array<{
      id: string;
      date: string;
      total: string;
      status: string;
    }>;
  } | null>(null);

  const customers = [
    {
      name: "Іван Петренко",
      email: "ivan@example.com",
      phone: "+380501234567",
      orders: 5,
      spent: "12,450₴",
      address: "м. Київ, вул. Шевченка 10, кв. 15",
      registrationDate: "2023-12-15",
      lastOrder: "2024-02-24",
      orderHistory: [
        {
          id: "ORD001",
          date: "2024-02-24",
          total: "2,450₴",
          status: "completed",
        },
        {
          id: "ORD002",
          date: "2024-01-15",
          total: "3,200₴",
          status: "completed",
        },
        {
          id: "ORD003",
          date: "2023-12-28",
          total: "1,800₴",
          status: "completed",
        },
      ],
    },
    {
      name: "Марія Коваленко",
      email: "maria@example.com",
      phone: "+380671234567",
      orders: 3,
      spent: "8,280₴",
      address: "м. Львів, вул. Франка 25, кв. 7",
      registrationDate: "2024-01-10",
      lastOrder: "2024-02-23",
      orderHistory: [
        {
          id: "ORD004",
          date: "2024-02-23",
          total: "1,280₴",
          status: "completed",
        },
        {
          id: "ORD005",
          date: "2024-02-10",
          total: "3,500₴",
          status: "completed",
        },
      ],
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedCustomer(customer)}
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

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Профіль клієнта</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Основна інформація</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{selectedCustomer?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{selectedCustomer?.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{selectedCustomer?.phone}</p>
                  </div>
                  {selectedCustomer?.address && (
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{selectedCustomer.address}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Статистика</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Дата реєстрації</p>
                    <p className="font-medium">{selectedCustomer?.registrationDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Останнє замовлення</p>
                    <p className="font-medium">{selectedCustomer?.lastOrder}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Всього замовлень</p>
                    <p className="font-medium">{selectedCustomer?.orders}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Загальна сума</p>
                    <p className="font-medium">{selectedCustomer?.spent}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Історія замовлень</h3>
                <div className="space-y-4">
                  {selectedCustomer?.orderHistory?.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total}</p>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          order.status === "completed" ? "bg-green-100 text-green-800" : 
                          "bg-yellow-100 text-yellow-800"
                        )}>
                          {order.status === "completed" ? "Виконано" : "Очікує"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AdminSettings = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  const settingsSections = [
    {
      id: "store",
      title: "Магазин",
      icon: Store,
      description: "Налаштування магазину, валюта, локалізація",
      settings: [
        { name: "Назва магазину", value: "Мій магазин", type: "text" },
        { name: "Валюта", value: "UAH", type: "select", options: ["UAH", "USD", "EUR"] },
        { name: "Мова", value: "Українська", type: "select", options: ["Українська", "English"] },
        { name: "Опис магазину", value: "Найкращий магазин електроніки", type: "textarea" },
        { name: "Телефон підтримки", value: "+380501234567", type: "text" },
        { name: "Email підтримки", value: "support@store.com", type: "email" },
      ]
    },
    {
      id: "notifications",
      title: "Сповіщення",
      icon: Bell,
      description: "Налаштування email та SMS сповіщень",
      settings: [
        { name: "Email сповіщення", value: true, type: "switch" },
        { name: "SMS сповіщення", value: false, type: "switch" },
        { name: "Push сповіщення", value: true, type: "switch" },
        { name: "Шаблон email", value: "Дякуємо за замовлення {order_id}", type: "textarea" },
      ]
    },
    {
      id: "shipping",
      title: "Доставка",
      icon: Package,
      description: "Налаштування методів доставки",
      settings: [
        { name: "Нова Пошта", value: true, type: "switch" },
        { name: "Укрпошта", value: true, type: "switch" },
        { name: "Самовивіз", value: true, type: "switch" },
        { name: "API ключ Нової Пошти", value: "************", type: "password" },
      ]
    },
    {
      id: "payment",
      title: "Оплата",
      icon: CreditCard,
      description: "Налаштування методів оплати",
      settings: [
        { name: "LiqPay", value: true, type: "switch" },
        { name: "Оплата при отриманні", value: true, type: "switch" },
        { name: "Банківський переказ", value: false, type: "switch" },
        { name: "Публічний ключ LiqPay", value: "************", type: "password" },
        { name: "Приватний ключ LiqPay", value: "************", type: "password" },
      ]
    },
    {
      id: "seo",
      title: "SEO",
      icon: Globe,
      description: "Налаштування для пошукової оптимізації",
      settings: [
        { 
          name: "META Title", 
          value: "Мій магазин - Найкращі товари за найкращими цінами", 
          type: "text" 
        },
        { 
          name: "META Description", 
          value: "Широкий вибір електроніки та аксесуарів. Швидка доставка по всій Україні. Гарантія якості та найкращі ціни.", 
          type: "textarea" 
        },
        { 
          name: "META Keywords", 
          value: "електроніка, гаджети, аксесуари, смартфони, ноутбуки", 
          type: "textarea" 
        },
        { 
          name: "Канонічні URL", 
          value: true, 
          type: "switch" 
        },
        { 
          name: "Автоматичні Alt-теги", 
          value: true, 
          type: "switch" 
        },
        { 
          name: "Robots.txt", 
          value: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /cart/\nSitemap: https://example.com/sitemap.xml", 
          type: "textarea" 
        },
        { 
          name: "Структуровані дані", 
          value: true, 
          type: "switch" 
        },
        { 
          name: "Open Graph теги", 
          value: true, 
          type: "switch" 
        },
        { 
          name: "Sitemap генерація", 
          value: true, 
          type: "switch" 
        },
        {
          name: "Google Analytics ID",
          value: "UA-XXXXXXXXX-X",
          type: "text"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Налаштування</h2>
        <Button>Зберегти всі зміни</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <section.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  </div>
                  <Dialog 
                    open={editingSection === section.id} 
                    onOpenChange={(open) => setEditingSection(open ? section.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Редагувати
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Редагування {section.title.toLowerCase()}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {section.settings.map((setting) => (
                          <div key={setting.name} className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                              {setting.name}
                            </label>
                            {setting.type === "text" && (
                              <Input
                                defaultValue={setting.value as string}
                                type="text"
                              />
                            )}
                            {setting.type === "email" && (
                              <Input
                                defaultValue={setting.value as string}
                                type="email"
                              />
                            )}
                            {setting.type === "password" && (
                              <Input
                                defaultValue={setting.value as string}
                                type="password"
                              />
                            )}
                            {setting.type === "textarea" && (
                              <textarea
                                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                defaultValue={setting.value as string}
                              />
                            )}
                            {setting.type === "select" && (
                              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                {setting.options?.map((option) => (
                                  <option 
                                    key={option} 
                                    selected={option === setting.value}
                                  >
                                    {option}
                                  </option>
                                ))}
                              </select>
                            )}
                            {setting.type === "switch" && (
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  defaultChecked={setting.value as boolean} 
                                  id={`${section.id}-${setting.name}`}
                                />
                                <label 
                                  htmlFor={`${section.id}-${setting.name}`}
                                  className="text-sm text-muted-foreground"
                                >
                                  {setting.value ? "Увімкнено" : "Вимкнено"}
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingSection(null)}
                        >
                          Скасувати
                        </Button>
                        <Button onClick={() => setEditingSection(null)}>
                          Зберегти
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mt-4 space-y-3">
                  {section.settings.slice(0, 3).map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between">
                      <span className="text-sm">{setting.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {typeof setting.value === "boolean" 
                          ? (setting.value ? "Увімкнено" : "Вимкнено")
                          : (setting.type === "password" 
                            ? "••••••••" 
                            : (typeof setting.value === "string" && setting.value.length > 50
                              ? `${setting.value.substring(0, 50)}...`
                              : setting.value))}
                      </span>
                    </div>
                  ))}
                  {section.settings.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{section.settings.length - 3} інших налаштувань
                    </p>
                  )}
                </div>
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
