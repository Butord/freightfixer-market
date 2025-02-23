
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
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";

const AdminDashboard = () => <div>Dashboard Content</div>;
const AdminOrders = () => <div>Orders Management</div>;
const AdminCustomers = () => <div>Customers Management</div>;
const AdminSettings = () => <div>Settings Content</div>;

const Admin = () => {
  const location = useLocation();

  const navigation = [
    { name: "Панель керування", path: "/admin", icon: Package },
    { name: "Товари", path: "/admin/products", icon: Package },
    { name: "Категорії", path: "/admin/categories", icon: Package },
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
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
