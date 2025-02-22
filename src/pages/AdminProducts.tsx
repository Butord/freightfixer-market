
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, ImagePlus } from "lucide-react";
import ApiService from "@/services/api";
import type { Product } from "@/types/api";

const AdminProducts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: ApiService.getProducts,
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsOpen(true);
  };

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Таблиця товарів */}
      <Card className="p-6">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Зображення</th>
                <th scope="col" className="px-6 py-3">Назва</th>
                <th scope="col" className="px-6 py-3">Ціна</th>
                <th scope="col" className="px-6 py-3">Категорія</th>
                <th scope="col" className="px-6 py-3">Дії</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id} className="bg-white border-b">
                  <td className="px-6 py-4">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <ImagePlus className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    {product.price.toLocaleString()} грн
                  </td>
                  <td className="px-6 py-4">
                    {product.category_id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Форма додавання/редагування товару */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {selectedProduct ? "Редагувати товар" : "Додати новий товар"}
            </SheetTitle>
          </SheetHeader>

          {/* TODO: Додати форму для товару */}
          <div className="py-4">
            Форма буде додана в наступному кроці
          </div>

          <SheetFooter>
            <Button type="submit">
              {selectedProduct ? "Зберегти зміни" : "Додати товар"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProducts;
