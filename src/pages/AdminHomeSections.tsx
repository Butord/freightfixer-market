
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  X, 
  GripVertical, 
  Eye,
  EyeOff, 
  Edit,
  Trash,
  ArrowUpDown,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Типи для секцій
type SectionType = 'hero' | 'categories' | 'new-products' | 'featured-products' | 'features';

interface HomeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
  settings: Record<string, any>;
}

// Початковий стан для демонстрації
const INITIAL_SECTIONS: HomeSection[] = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Баннер',
    visible: true,
    order: 1,
    settings: {
      title: 'Якісні запчастини для вашої вантажівки',
      subtitle: 'Великий вибір оригінальних запчастин за найкращими цінами',
      buttonText: 'Перейти до каталогу',
      buttonLink: '/categories',
      backgroundImage: '/placeholder.svg'
    }
  },
  {
    id: 'categories',
    type: 'categories',
    title: 'Популярні категорії',
    visible: true,
    order: 2,
    settings: {
      showTitle: true,
      maxItems: 4
    }
  },
  {
    id: 'new-products',
    type: 'new-products',
    title: 'Новинки',
    visible: true,
    order: 3,
    settings: {
      showTitle: true,
      maxItems: 4,
      showBadge: true
    }
  },
  {
    id: 'featured-products',
    type: 'featured-products',
    title: 'Популярні товари',
    visible: true,
    order: 4,
    settings: {
      showTitle: true,
      maxItems: 4
    }
  },
  {
    id: 'features',
    type: 'features',
    title: 'Наші переваги',
    visible: true,
    order: 5,
    settings: {
      items: [
        { title: 'Швидка доставка', description: 'Доставляємо по всій Україні через надійні служби доставки' },
        { title: 'Гарантія якості', description: 'Всі запчастини від перевірених виробників з гарантією' },
        { title: 'Технічна підтримка', description: 'Наші спеціалісти завжди готові допомогти з вибором' }
      ]
    }
  }
];

const AdminHomeSections = () => {
  const [sections, setSections] = useState<HomeSection[]>(INITIAL_SECTIONS);
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [editMode, setEditMode] = useState<'edit' | 'create'>('edit');
  const { toast } = useToast();

  // Функція для оновлення видимості секції
  const toggleSectionVisibility = (id: string) => {
    setSections(sections.map(section => 
      section.id === id 
        ? { ...section, visible: !section.visible } 
        : section
    ));
  };

  // Функція для видалення фічі з секції "Наші переваги"
  const removeFeature = (sectionId: string, featureIndex: number) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const updatedItems = [...section.settings.items];
        updatedItems.splice(featureIndex, 1);
        return {
          ...section,
          settings: {
            ...section.settings,
            items: updatedItems
          }
        };
      }
      return section;
    }));
  };

  // Функція для додавання нової фічі до секції "Наші переваги"
  const addFeature = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          settings: {
            ...section.settings,
            items: [
              ...section.settings.items,
              { title: 'Нова перевага', description: 'Опис нової переваги' }
            ]
          }
        };
      }
      return section;
    }));
  };

  // Функція для переміщення секції вгору/вниз
  const moveSection = (id: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && sectionIndex === 0) || 
      (direction === 'down' && sectionIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    // Міняємо місцями
    [newSections[sectionIndex], newSections[targetIndex]] = 
    [newSections[targetIndex], newSections[sectionIndex]];
    
    // Оновлюємо порядкові номери
    newSections.forEach((section, index) => {
      newSections[index] = { ...section, order: index + 1 };
    });
    
    setSections(newSections);
  };

  // Функція для редагування секції
  const editSection = (section: HomeSection) => {
    setEditingSection({ ...section });
    setEditMode('edit');
  };

  // Функція для збереження змін
  const saveChanges = () => {
    if (!editingSection) return;

    if (editMode === 'edit') {
      setSections(sections.map(section => 
        section.id === editingSection.id ? editingSection : section
      ));
    } else {
      // Для створення нової секції (якщо буде додано в майбутньому)
      setSections([...sections, { ...editingSection, id: Date.now().toString() }]);
    }

    setEditingSection(null);
    toast({
      title: "Зміни збережено",
      description: "Налаштування розділів успішно оновлено",
    });
  };

  // Обробка зміни в поточній секції
  const handleSectionChange = (field: keyof HomeSection, value: any) => {
    if (!editingSection) return;
    setEditingSection({ ...editingSection, [field]: value });
  };

  // Обробка зміни налаштувань секції
  const handleSettingChange = (key: string, value: any) => {
    if (!editingSection) return;
    setEditingSection({
      ...editingSection,
      settings: {
        ...editingSection.settings,
        [key]: value
      }
    });
  };

  // Обробка зміни налаштувань для вкладених об'єктів (наприклад, фічі)
  const handleNestedSettingChange = (key: string, index: number, field: string, value: any) => {
    if (!editingSection || !editingSection.settings[key]) return;
    
    const updatedItems = [...editingSection.settings[key]];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    setEditingSection({
      ...editingSection,
      settings: {
        ...editingSection.settings,
        [key]: updatedItems
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Розділи головної сторінки</h2>
        <Button onClick={() => saveChanges()}>Зберегти всі зміни</Button>
      </div>

      <div className="space-y-4">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
          <Card key={section.id} className={`${!section.visible ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <CardTitle>{section.title}</CardTitle>
                  {!section.visible && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Приховано
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={section.order === 1}
                  >
                    <ArrowUpDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={section.order === sections.length}
                  >
                    <ArrowUpDown className="h-4 w-4 -rotate-90" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSectionVisibility(section.id)}
                  >
                    {section.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editSection(section)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Редагування розділу "{section.title}"</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="section-title">Заголовок розділу</Label>
                            <Input 
                              id="section-title" 
                              value={editingSection?.title || ''} 
                              onChange={(e) => handleSectionChange('title', e.target.value)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="section-visible"
                              checked={editingSection?.visible || false}
                              onCheckedChange={(checked) => handleSectionChange('visible', checked)}
                            />
                            <Label htmlFor="section-visible">Відображати розділ</Label>
                          </div>
                        </div>

                        <Separator />

                        {/* Специфічні налаштування в залежності від типу секції */}
                        {editingSection?.type === 'hero' && (
                          <div className="space-y-4">
                            <h4 className="font-medium">Налаштування банера</h4>
                            <div className="space-y-2">
                              <Label htmlFor="hero-title">Заголовок банера</Label>
                              <Input 
                                id="hero-title" 
                                value={editingSection?.settings?.title || ''} 
                                onChange={(e) => handleSettingChange('title', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hero-subtitle">Підзаголовок</Label>
                              <Input 
                                id="hero-subtitle" 
                                value={editingSection?.settings?.subtitle || ''} 
                                onChange={(e) => handleSettingChange('subtitle', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hero-button-text">Текст кнопки</Label>
                              <Input 
                                id="hero-button-text" 
                                value={editingSection?.settings?.buttonText || ''} 
                                onChange={(e) => handleSettingChange('buttonText', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hero-button-link">Посилання кнопки</Label>
                              <Input 
                                id="hero-button-link" 
                                value={editingSection?.settings?.buttonLink || ''} 
                                onChange={(e) => handleSettingChange('buttonLink', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Фонове зображення</Label>
                              <div className="max-w-sm mx-auto">
                                <ImageUpload 
                                  previewUrl={editingSection?.settings?.backgroundImage || null}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        handleSettingChange('backgroundImage', reader.result);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {(editingSection?.type === 'categories' || 
                          editingSection?.type === 'featured-products' || 
                          editingSection?.type === 'new-products') && (
                          <div className="space-y-4">
                            <h4 className="font-medium">Налаштування розділу</h4>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id="show-title"
                                checked={editingSection?.settings?.showTitle || false}
                                onCheckedChange={(checked) => handleSettingChange('showTitle', checked)}
                              />
                              <Label htmlFor="show-title">Показувати заголовок розділу</Label>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="max-items">Максимальна кількість елементів</Label>
                              <Select 
                                value={String(editingSection?.settings?.maxItems || 4)}
                                onValueChange={(value) => handleSettingChange('maxItems', Number(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Виберіть кількість" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="8">8</SelectItem>
                                  <SelectItem value="12">12</SelectItem>
                                  <SelectItem value="16">16</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {editingSection?.type === 'new-products' && (
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id="show-badge"
                                  checked={editingSection?.settings?.showBadge || false}
                                  onCheckedChange={(checked) => handleSettingChange('showBadge', checked)}
                                />
                                <Label htmlFor="show-badge">Показувати мітку "Новинка"</Label>
                              </div>
                            )}
                          </div>
                        )}

                        {editingSection?.type === 'features' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Переваги</h4>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => editingSection && addFeature(editingSection.id)}
                              >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Додати перевагу
                              </Button>
                            </div>
                            {editingSection?.settings?.items?.map((item: any, index: number) => (
                              <Card key={index} className="p-4 relative">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeFeature(editingSection.id, index)}
                                  className="absolute right-2 top-2"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                                <div className="space-y-3 pt-4">
                                  <div className="space-y-1">
                                    <Label htmlFor={`feature-title-${index}`}>Заголовок</Label>
                                    <Input 
                                      id={`feature-title-${index}`}
                                      value={item.title} 
                                      onChange={(e) => handleNestedSettingChange('items', index, 'title', e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`feature-desc-${index}`}>Опис</Label>
                                    <Input 
                                      id={`feature-desc-${index}`}
                                      value={item.description} 
                                      onChange={(e) => handleNestedSettingChange('items', index, 'description', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Скасувати</Button>
                        </DialogClose>
                        <Button onClick={saveChanges}>Зберегти зміни</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {section.type === 'hero' && 'Головний банер із заголовком, підзаголовком та кнопкою дії.'}
                {section.type === 'categories' && 'Показує популярні категорії в каталозі.'}
                {section.type === 'new-products' && 'Відображає нові товари з міткою "Новинка".'}
                {section.type === 'featured-products' && 'Показує популярні або рекомендовані товари.'}
                {section.type === 'features' && 'Список переваг вашого магазину.'}
              </div>
              
              {section.type === 'features' && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm">Переваги:</h4>
                  <div className="pl-4 space-y-1">
                    {section.settings.items.map((item: any, index: number) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{item.title}</span>
                        {' - '}
                        <span className="text-muted-foreground">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminHomeSections;
