import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientRegister from "./pages/ClientRegister";
import AdminUsers from "./pages/AdminUsers";
import AdminSetup from "./pages/AdminSetup";
import AdminPages from "./pages/AdminPages";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";

const queryClient = new QueryClient();

// Оновлено базовий шлях - прибрано "/arm3/"
const basename = import.meta.env.BASE_URL || '/';

const App = () => {
  const { checkAuth } = useAuthStore();

  // Перевіряємо автентифікацію при завантаженні програми
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="categories" element={<Categories />} />
              <Route path="category/:id" element={<Category />} />
              <Route path="product/:id" element={<Product />} />
              <Route path="cart" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="client-register" element={<ClientRegister />} />
              <Route path="admin-setup" element={<AdminSetup />} />
              <Route path="about" element={<About />} />
              <Route path="contacts" element={<Contacts />} />
              
              {/* Захищені маршрути для авторизованих користувачів */}
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<div>Профіль користувача</div>} />
                <Route path="orders" element={<div>Мої замовлення</div>} />
              </Route>
              
              {/* Захищені маршрути для адміністраторів */}
              <Route element={<ProtectedRoute requireAdmin />}>
                <Route path="admin/*" element={<Admin />} />
                <Route path="admin/users" element={<AdminUsers />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
