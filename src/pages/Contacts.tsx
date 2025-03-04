
import { useState, useEffect } from "react";
import { PageContent } from "@/types/pages";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contacts = () => {
  const [pageData, setPageData] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // В майбутньому тут буде запит до API
    // Поки використовуємо моковані дані
    const mockData: PageContent = {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{pageData?.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center p-4">
              <Phone className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Телефони</h3>
              <p>+380 44 123 4567</p>
              <p>+380 50 987 6543</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center p-4">
              <Mail className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p>info@truckparts.com</p>
              <p>support@truckparts.com</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center p-4">
              <MapPin className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Адреса</h3>
              <p>м. Київ, вул. Автомобільна, 123</p>
              <p>м. Львів, вул. Транспортна, 45</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div dangerouslySetInnerHTML={{ __html: pageData?.content || '' }} />
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Зв'яжіться з нами</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary" />
                <span>+380 44 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@truckparts.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>м. Київ, вул. Автомобільна, 123</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Пн-Пт: 9:00-18:00, Сб: 10:00-15:00</span>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-center text-muted-foreground">
                Тут буде карта розташування офісу
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
