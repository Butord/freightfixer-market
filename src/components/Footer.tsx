
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">TruckParts</h3>
            <p className="text-neutral-400">
              Ваш надійний постачальник запчастин для вантажних автомобілів
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Навігація</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors">
                  Головна
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-neutral-400 hover:text-white transition-colors">
                  Категорії
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors">
                  Про нас
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакти</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>Телефон: +380 XX XXX XX XX</li>
              <li>Email: info@truckparts.com</li>
              <li>Адреса: м. Київ, вул. Прикладна, 1</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Соціальні мережі</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
          <p>&copy; 2024 TruckParts. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
