
import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Users,
  Settings,
  PlusCircle,
} from "lucide-react";

const AdminDashboard = () => <div>Dashboard Content</div>;
const AdminProducts = () => <div>Products Management</div>;
const AdminOrders = () => <div>Orders Management</div>;
const AdminCustomers = () => <div>Customers Management</div>;
const AdminSettings = () => <div>Settings Content</div>;

const Admin = () => {
  const location = useLocation();

  const navigation = [
    { name: "Панель керування", path: "/admin", icon: Package },
    { name: "Товари", path: "/admin/products", icon: Package },
    { name: "Замовлення", path: "/admin/orders", icon: ShoppingCart },
    { name: "Клієнти", path: "/admin/customers", icon: Users },
    { name: "Налаштування", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 text-sm hover:bg-gray-50 ${
                  isActive ? "bg-primary/5 text-primary" : "text-gray-700"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            {navigation.find((item) => item.path === location.pathname)?.name ||
              "Панель керування"}
          </h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Додати товар
          </Button>
        </div>

        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
