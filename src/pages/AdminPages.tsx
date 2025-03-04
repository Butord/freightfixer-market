
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContent, PageContentUpdateRequest } from "@/types/pages";
import { Pencil, Save, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminPages = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<PageContentUpdateRequest>({
    title: "",
    content: "",
    meta_title: "",
    meta_description: ""
  });

  useEffect(() => {
    // В майбутньому тут буде запит до API
    // Поки використовуємо моковані дані
    const mockPages: PageContent[] = [
      {
        id: 1,
        title: "Про нас",
        content: `
          <div>
            <h2 class="text-2xl font-bold mb-4">Вітаємо в TruckParts!</h2>
            
            <p class="mb-4">
              Компанія <strong>TruckParts</strong> вже понад 10 років є надійним постачальником запчастин для вантажних автомобілів. Ми пропонуємо широкий асортимент оригінальних та аналогових запчастин для різних моделей вантажівок.
            </p>
            
            <h3 class="text-xl font-bold mt-6 mb-3">Наші переваги:</h3>
            
            <ul class="list-disc pl-6 mb-4 space-y-2">
              <li>Великий асортимент запчастин в наявності та під замовлення</li>
              <li>Швидка доставка по всій Україні</li>
              <li>Конкурентні ціни</li>
              <li>Професійні консультації від експертів</li>
              <li>Гарантія на всі запчастини</li>
            </ul>
            
            <h3 class="text-xl font-bold mt-6 mb-3">Наша місія</h3>
            
            <p class="mb-4">
              Забезпечувати клієнтів якісними запчастинами за доступними цінами та професійною консультацією, щоб їхня техніка завжди була в робочому стані.
            </p>
            
            <h3 class="text-xl font-bold mt-6 mb-3">Наша команда</h3>
            
            <p class="mb-4">
              У нашій команді працюють досвідчені фахівці, які мають багаторічний досвід роботи з вантажними автомобілями. Ми постійно підвищуємо свою кваліфікацію, щоб надавати клієнтам найкращі рішення.
            </p>
          </div>
        `,
        slug: "about",
        meta_title: "Про компанію TruckParts - Запчастини для вантажівок",
        meta_description: "Компанія TruckParts - ваш надійний постачальник запчастин для вантажних автомобілів. Широкий асортимент, швидка доставка, професійні консультації.",
        updated_at: "2023-04-15T10:30:00"
      },
      {
        id: 2,
        title: "Контакти",
        content: `
          <div>
            <p class="mb-4">
              Ми завжди раді відповісти на ваші запитання та допомогти з вибором запчастин для вашого вантажного автомобіля.
            </p>
            
            <h3 class="text-xl font-bold mt-6 mb-3">Графік роботи:</h3>
            <p class="mb-4">
              Понеділок - П'ятниця: 9:00 - 18:00<br>
              Субота: 10:00 - 15:00<br>
              Неділя: Вихідний
            </p>
          </div>
        `,
        slug: "contacts",
        meta_title: "Контакти TruckParts - Зв'яжіться з нами",
        meta_description: "Контактна інформація компанії TruckParts. Телефони, адреси офісів та магазинів, графік роботи та форма зворотнього зв'язку.",
        updated_at: "2023-04-16T14:45:00"
      }
    ];

    setTimeout(() => {
      setPages(mockPages);
      if (mockPages.length > 0) {
        setSelectedPage(mockPages[0]);
        setFormData({
          title: mockPages[0].title,
          content: mockPages[0].content,
          meta_title: mockPages[0].meta_title || "",
          meta_description: mockPages[0].meta_description || ""
        });
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSelectPage = (page: PageContent) => {
    setSelectedPage(page);
    setFormData({
      title: page.title,
      content: page.content,
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || ""
    });
    setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!selectedPage) return;

    // Оновлюємо сторінку локально (імітація API)
    const updatedPage: PageContent = {
      ...selectedPage,
      title: formData.title,
      content: formData.content,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      updated_at: new Date().toISOString()
    };

    setPages(prev => prev.map(p => (p.id === updatedPage.id ? updatedPage : p)));
    setSelectedPage(updatedPage);
    setEditMode(false);
    toast.success(`Сторінку "${updatedPage.title}" успішно оновлено!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Управління сторінками</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Сторінки</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {pages.map(page => (
                <li key={page.id}>
                  <Button 
                    variant={selectedPage?.id === page.id ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => handleSelectPage(page)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {page.title}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{selectedPage?.title || "Виберіть сторінку"}</CardTitle>
            <div className="flex space-x-2">
              {!editMode ? (
                <Button onClick={() => setEditMode(true)} disabled={!selectedPage}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Редагувати
                </Button>
              ) : (
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Зберегти
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedPage ? (
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Вміст</TabsTrigger>
                  <TabsTrigger value="meta">SEO</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4 mt-4">
                  {editMode ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="title">Заголовок</Label>
                        <Input 
                          id="title" 
                          name="title" 
                          value={formData.title} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Вміст сторінки (HTML)</Label>
                        <Textarea 
                          id="content" 
                          name="content" 
                          value={formData.content} 
                          onChange={handleInputChange}
                          className="min-h-[400px] font-mono"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="border rounded-md p-4">
                      <h3 className="text-xl font-bold mb-4">{selectedPage.title}</h3>
                      <div dangerouslySetInnerHTML={{ __html: selectedPage.content }} />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="meta" className="space-y-4 mt-4">
                  {editMode ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="meta_title">META заголовок</Label>
                        <Input 
                          id="meta_title" 
                          name="meta_title" 
                          value={formData.meta_title} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meta_description">META опис</Label>
                        <Textarea 
                          id="meta_description" 
                          name="meta_description" 
                          value={formData.meta_description} 
                          onChange={handleInputChange}
                          className="min-h-[100px]"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="border rounded-md p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">META заголовок:</h4>
                          <p className="border-t pt-2">{selectedPage.meta_title}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">META опис:</h4>
                          <p className="border-t pt-2">{selectedPage.meta_description}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">URL:</h4>
                          <p className="border-t pt-2">/{selectedPage.slug}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Останнє оновлення:</h4>
                          <p className="border-t pt-2">
                            {new Date(selectedPage.updated_at).toLocaleString('uk-UA')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Виберіть сторінку для редагування
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPages;
