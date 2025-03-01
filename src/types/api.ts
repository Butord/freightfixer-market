
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  user_id?: number;
  total: number;
  status: string;
  delivery_method: string;
  payment_method: string;
  city: string;
  department: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
  items?: OrderItem[];
}
