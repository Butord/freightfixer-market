
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
} from "lucide-react";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import { cn } from "@/lib/utils";

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
              {/* Тут буде графік або таблиця з замовленнями */}
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
              {/* Тут буде список популярних товарів */}
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

const AdminOrders = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold tracking-tight">Замовлення</h2>
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="text-muted-foreground">
          Тут буде список замовлень...
        </div>
      </div>
    </div>
  </div>
);

const AdminCustomers = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold tracking-tight">Клієнти</h2>
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="text-muted-foreground">
          Тут буде список клієнтів...
        </div>
      </div>
    </div>
  </div>
);

const AdminSettings = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold tracking-tight">Налаштування</h2>
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="text-muted-foreground">
          Тут будуть налаштування магазину...
        </div>
      </div>
    </div>
  </div>
);

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
      {/* Sidebar */}
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

      {/* Main Content */}
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
