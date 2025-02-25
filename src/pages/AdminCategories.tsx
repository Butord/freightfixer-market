
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
import { Plus, ImagePlus, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { ImageUpload } from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";
import ApiService from "@/services/api";
import type { Category } from "@/types/api";

const AdminCategories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: ApiService.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: ApiService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Успішно!",
        description: "Категорію успішно створено",
      });
      setIsOpen(false);
      setPreviewImage(null);
    },
    onError: () => {
      toast({
        title: "Помилка!",
        description: "Не вдалося створити категорію",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      ApiService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Успішно!",
        description: "Категорію успішно оновлено",
      });
      setIsOpen(false);
      setPreviewImage(null);
    },
    onError: () => {
      toast({
        title: "Помилка!",
        description: "Не вдалося оновити категорію",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ApiService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Успішно!",
        description: "Категорію успішно видалено",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Помилка!",
        description: error.message || "Не вдалося видалити категорію",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setPreviewImage(category.image);
    setIsOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setPreviewImage(null);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю категорію?')) {
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
      if (selectedCategory) {
        await updateMutation.mutateAsync({
          id: selectedCategory.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  const columns = [
    {
      header: "Зображення",
      key: "image" as const,
      render: (category: Category) => (
        category.image ? (
          <img 
            src={category.image} 
            alt={category.name} 
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
      header: "Дії",
      key: "actions" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Додати категорію
        </Button>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedCategory ? "Редагувати категорію" : "Додати нову категорію"}
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Назва категорії
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={selectedCategory?.name}
                  className="w-full rounded-md border border-gray-200 p-2"
                />
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
                  <label htmlFor="meta_title" className="text-sm font-medium">
                    META Title
                  </label>
                  <input
                    id="meta_title"
                    name="meta_title"
                    type="text"
                    defaultValue={selectedCategory?.meta_title}
                    className="w-full rounded-md border border-gray-200 p-2"
                    placeholder="Найкращі товари в категорії {назва категорії}"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="meta_description" className="text-sm font-medium">
                    META Description
                  </label>
                  <textarea
                    id="meta_description"
                    name="meta_description"
                    rows={3}
                    defaultValue={selectedCategory?.meta_description}
                    className="w-full rounded-md border border-gray-200 p-2"
                    placeholder="Широкий вибір товарів в категорії {назва категорії}. Найкращі ціни та швидка доставка."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="meta_keywords" className="text-sm font-medium">
                    META Keywords
                  </label>
                  <textarea
                    id="meta_keywords"
                    name="meta_keywords"
                    rows={2}
                    defaultValue={selectedCategory?.meta_keywords}
                    className="w-full rounded-md border border-gray-200 p-2"
                    placeholder="категорія, товари, ключові слова через кому"
                  />
                </div>
              </div>
            </div>

            <SheetFooter>
              <Button type="submit">
                {selectedCategory ? "Зберегти зміни" : "Додати категорію"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminCategories;
