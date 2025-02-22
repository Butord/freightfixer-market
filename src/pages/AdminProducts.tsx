
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
import { Pencil, Trash2, ImagePlus, Plus } from "lucide-react";
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const productData = {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      category_id: Number(formData.get("category_id")),
      image: "",  // TODO: Add image upload
    };

    try {
      if (selectedProduct) {
        // Update existing product
        // await ApiService.updateProduct(selectedProduct.id, productData);
      } else {
        // Create new product
        // await ApiService.createProduct(productData);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Кнопка для створення нового товару */}
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Додати товар
        </Button>
      </div>

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

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Назва товару
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={selectedProduct?.name}
                className="w-full rounded-md border border-gray-200 p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Ціна
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                defaultValue={selectedProduct?.price}
                className="w-full rounded-md border border-gray-200 p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Опис
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={selectedProduct?.description}
                className="w-full rounded-md border border-gray-200 p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Категорія
              </label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={selectedProduct?.category_id}
                className="w-full rounded-md border border-gray-200 p-2"
              >
                <option value="">Виберіть категорію</option>
                {/* TODO: Add categories from API */}
                <option value="1">Категорія 1</option>
                <option value="2">Категорія 2</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Зображення
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Натисніть для завантаження</span> або перетягніть файл
                    </p>
                  </div>
                  <input type="file" name="image" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>

            <SheetFooter>
              <Button type="submit">
                {selectedProduct ? "Зберегти зміни" : "Додати товар"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProducts;
