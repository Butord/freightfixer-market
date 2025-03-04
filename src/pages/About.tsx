
import { useState, useEffect } from "react";
import { PageContent } from "@/types/pages";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const About = () => {
  const [pageData, setPageData] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // В майбутньому тут буде запит до API
    // Поки використовуємо моковані дані
    const mockData: PageContent = {
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
    };

    setTimeout(() => {
      setPageData(mockData);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Оновлюємо метадані сторінки
  useEffect(() => {
    if (pageData) {
      document.title = pageData.meta_title || pageData.title;
      
      // Шукаємо мета-опис або створюємо новий
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', pageData.meta_description || '');
    }
  }, [pageData]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-5/6 mb-8" />
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/6 mb-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{pageData?.title}</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div dangerouslySetInnerHTML={{ __html: pageData?.content || '' }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
