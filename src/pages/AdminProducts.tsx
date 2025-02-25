
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ImagePlus, Plus, Globe, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { ImageUpload } from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ApiService from "@/services/api";
import type { Product } from "@/types/api";

const AdminProducts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: ApiService.getProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: ApiService.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: ApiService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Успішно!",
        description: "Товар успішно створено",
      });
      setIsOpen(false);
      setPreviewImage(null);
    },
    onError: () => {
      toast({
        title: "Помилка!",
        description: "Не вдалося створити товар",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      ApiService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Успішно!",
        description: "Товар успішно оновлено",
      });
      setIsOpen(false);
      setPreviewImage(null);
    },
    onError: () => {
      toast({
        title: "Помилка!",
        description: "Не вдалося оновити товар",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ApiService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Успішно!",
        description: "Товар успішно видалено",
      });
    },
    onError: () => {
      toast({
        title: "Помилка!",
        description: "Не вдалося видалити товар",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setPreviewImage(product.image);
    setIsOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setPreviewImage(null);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      if (selectedProduct) {
        await updateMutation.mutateAsync({
          id: selectedProduct.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  const columns = [
    {
      header: "Зображення",
      key: "image" as const,
      render: (product: Product) => (
        product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            <ImagePlus className="w-6 h-6 text-gray-400" />
          </div>
        )
      ),
    },
    {
      header: "Назва",
      key: "name" as const,
    },
    {
      header: "Ціна",
      key: "price" as const,
      render: (product: Product) => (
        `${product.price.toLocaleString()} грн`
      ),
    },
    {
      header: "Категорія",
      key: "category_id" as const,
      render: (product: Product) => {
        const category = categories.find(c => c.id === product.category_id);
        return category?.name || 'Невідома категорія';
      },
    },
    {
      header: "Дії",
      key: "actions" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Додати товар
        </Button>
      </div>

      <DataTable
        data={products}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedProduct ? "Редагувати товар" : "Додати новий товар"}
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-4">
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
                <label htmlFor="category_id" className="text-sm font-medium">
                  Категорія
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  defaultValue={selectedProduct?.category_id}
                  className="w-full rounded-md border border-gray-200 p-2"
                  required
                >
                  <option value="">Виберіть категорію</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Зображення
                </label>
                <ImageUpload
                  previewUrl={previewImage}
                  onChange={handleImageChange}
                />
              </div>

              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <h4 className="font-medium">SEO налаштування</h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="meta_title" className="text-sm font-medium">
                      META Title
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[250px] text-xs">
                            Якщо не заповнено, буде використано шаблон:<br />
                            "Купити {{productName}} за найкращою ціною в Україні | Мій магазин"
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <input
                    id="meta_title"
                    name="meta_title"
                    type="text"
                    defaultValue={selectedProduct?.meta_title}
                    className="w-full rounded-md border border-gray-200 p-2"
                    placeholder="Купити {назва товару} за найкращою ціною"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="meta_description" className="text-sm font-medium">
                      META Description
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[250px] text-xs">
                            Якщо не заповнено, буде використано шаблон:<br />
                            "✅ {{productName}} в наявності! Гарантія якості ➜ Найкраща ціна ➜ Швидка доставка по всій Україні ✓ Відгуки покупців"
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <textarea
                    id="meta_description"
                    name="meta_description"
                    rows={3}
                    defaultValue={selectedProduct?.meta_description}
                    className="w-full rounded-md border border-gray-200 p-2"
                    placeholder="✅ Офіційна гарантія на {назва товару} ➜ Найкраща ціна ➜ Швидка доставка ➜ Відгуки покупців"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="meta_keywords" className="text-sm font-medium">
                      META Keywords
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="w-[250px] text-xs">
                            Якщо не заповнено, буде використано шаблон:<br />
                            "{{productName}}, купити {{productName}}, ціна, доставка"
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <textarea
                    id="meta_keywords"
                    name="meta_keywords"
                    rows={2}
                    defaultValue={selectedProduct?.meta_keywords}
                    className="w-full rounded-md border border-gray-200 p-2"
                    placeholder="назва товару, купити, ціна, доставка"
                  />
                </div>
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
