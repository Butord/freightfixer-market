
import ApiConfig from './config';
import AuthApi from './auth';
import ProductsApi from './products';
import CategoriesApi from './categories';
import OrdersApi from './orders';
import UsersApi from './users';

// Реекспорт усіх API модулів для збереження зворотної сумісності
const ApiService = {
  // Конфігурація API
  ...ApiConfig,
  
  // Аутентифікація
  login: AuthApi.login,
  register: AuthApi.register,
  getCurrentUser: AuthApi.getCurrentUser,
  
  // Користувачі
  getUsers: UsersApi.getUsers,
  updateUser: UsersApi.updateUser,
  deleteUser: UsersApi.deleteUser,
  
  // Товари
  getProducts: ProductsApi.getProducts,
  getProduct: ProductsApi.getProduct,
  createProduct: ProductsApi.createProduct,
  updateProduct: ProductsApi.updateProduct,
  deleteProduct: ProductsApi.deleteProduct,
  
  // Категорії
  getCategories: CategoriesApi.getCategories,
  getCategory: CategoriesApi.getCategory,
  createCategory: CategoriesApi.createCategory,
  updateCategory: CategoriesApi.updateCategory,
  deleteCategory: CategoriesApi.deleteCategory,
  
  // Замовлення
  getOrders: OrdersApi.getOrders,
  getOrder: OrdersApi.getOrder,
  createOrder: OrdersApi.createOrder,
  updateOrderStatus: OrdersApi.updateOrderStatus,
  cancelOrder: OrdersApi.cancelOrder,
};

export default ApiService;
