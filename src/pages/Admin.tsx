
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
        { name: "Часовий пояс", value: "Europe/Kiev", type: "select", options: ["Europe/Kiev", "Europe/London", "Europe/Berlin", "America/New_York"] }
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
    },
    {
      id: "seo_patterns",
      title: "SEO патерни",
      icon: Search,
      description: "Шаблони для автоматичної генерації SEO-даних",
      settings: [
        { 
          name: "Шаблон Title для товарів", 
          value: "Купити {{productName}} за найкращою ціною в Україні | Мій магазин", 
          type: "text" 
        },
        { 
          name: "Шаблон Description для товарів", 
          value: "✅ {{productName}} в наявності! Гарантія якості ➜ Найкраща ціна ➜ Швидка доставка по всій Україні ✓ Відгуки покупців", 
          type: "textarea" 
        },
        { 
          name: "Шаблон Keywords для товарів", 
          value: "{{productName}}, купити {{productName}}, ціна, доставка", 
          type: "textarea" 
        },
        { 
          name: "Шаблон Title для категорій", 
          value: "{{categoryName}} - купити в інтернет-магазині | Мій магазин", 
          type: "text" 
        },
        { 
          name: "Шаблон Description для категорій", 
          value: "Великий вибір товарів в категорії {{categoryName}}. ✓ Офіційна гарантія ➜ Кращі ціни ➜ Доставка по всій Україні", 
          type: "textarea" 
        },
        { 
          name: "Шаблон Keywords для категорій", 
          value: "{{categoryName}}, купити {{categoryName}}, ціна, каталог", 
          type: "textarea" 
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
                      {section.id === "seo_patterns" ? (
                        <Tabs defaultValue="products">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="products">Товари</TabsTrigger>
                            <TabsTrigger value="categories">Категорії</TabsTrigger>
                          </TabsList>
                          <TabsContent value="products" className="space-y-4 py-4">
                            {section.settings.slice(0, 3).map((setting) => (
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
                                {setting.type === "textarea" && (
                                  <textarea
                                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    defaultValue={setting.value as string}
                                  />
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Використовуйте {"{{productName}}"}, {"{{price}}"}, {"{{description}}"} як змінні
                                </p>
                              </div>
                            ))}
                          </TabsContent>
                          <TabsContent value="categories" className="space-y-4 py-4">
                            {section.settings.slice(3, 6).map((setting) => (
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
                                {setting.type === "textarea" && (
                                  <textarea
                                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    defaultValue={setting.value as string}
                                  />
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Використовуйте {"{{categoryName}}"} як змінну
                                </p>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      ) : (
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
                      )}
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

  // Вибір поточного активного посилання
  const isLinkActive = (path: string) => {
    const currentPath = location.pathname;
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen">
      {/* Бічна панель навігації */}
      <div className="w-64 bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Адмін панель</h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                isLinkActive("/admin") && !isLinkActive("/admin/products") && !isLinkActive("/admin/categories") && !isLinkActive("/admin/orders") && !isLinkActive("/admin/customers") && !isLinkActive("/admin/settings")
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Панель управління</span>
            </Link>

            <Link
              to="/admin/products"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                isLinkActive("/admin/products")
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
            >
              <Package className="h-4 w-4" />
              <span>Товари</span>
            </Link>

            <Link
              to="/admin/categories"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                isLinkActive("/admin/categories")
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
            >
              <FolderTree className="h-4 w-4" />
              <span>Категорії</span>
            </Link>

            <Link
              to="/admin/orders"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                isLinkActive("/admin/orders")
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Замовлення</span>
            </Link>

            <Link
              to="/admin/customers"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                isLinkActive("/admin/customers")
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
            >
              <Users className="h-4 w-4" />
              <span>Клієнти</span>
            </Link>

            <Separator className="my-2" />

            <Link
              to="/admin/settings"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                isLinkActive("/admin/settings")
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Налаштування</span>
            </Link>
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full">
            <Link to="/" className="w-full flex items-center justify-center">
              На сайт
            </Link>
          </Button>
        </div>
      </div>

      {/* Основний вміст */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/customers" element={<AdminCustomers />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
