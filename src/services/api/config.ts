
// Базова конфігурація та утиліти для API

// Отримати базовий URL API з змінних середовища
// На шаред хостингу фронтенд і бекенд часто знаходяться на одному домені
const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  
  // Якщо починається з '/', це відносний шлях на тому ж домені
  if (apiUrl.startsWith('/')) {
    return apiUrl.replace(/\/$/, '');
  }
  
  // Інакше використовуємо як повний URL
  return apiUrl.replace(/\/$/, '');
};

const API_BASE_URL = getApiBaseUrl();

// Для відображення URL в консолі - допомагає при налагодженні
console.log('API Base URL:', API_BASE_URL);

/**
 * Допоміжна функція для обробки помилок відповіді API
 */
const handleApiResponse = async (response: Response) => {
  if (!response) {
    console.error('Empty response received');
    throw new Error('Не вдалося отримати відповідь від сервера');
  }

  // Перевірити чи відповідь ОК перед спробою розбору JSON
  if (!response.ok) {
    // Спочатку спробувати розібрати JSON відповідь про помилку
    try {
      const errorData = await response.json();
      console.error('Server error response:', errorData);
      throw new Error(errorData.message || `Помилка сервера: ${response.status} ${response.statusText}`);
    } catch (jsonError) {
      // Якщо відповідь не JSON, отримати як текст
      try {
        const text = await response.text();
        console.error('Non-JSON error response:', text ? text.substring(0, 500) : '(empty response)'); // Журналювати перші 500 символів
      } catch (textError) {
        console.error('Could not read response body');
      }
      
      // Включити URL, який не вдався, в повідомлення про помилку
      const url = response.url || 'unknown URL';
      throw new Error(`Помилка сервера: ${response.status} ${response.statusText} при запиті до ${url}`);
    }
  }

  // Перевірити порожні відповіді
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0') {
    console.error('Empty response body received');
    return { success: false, message: 'Сервер повернув порожню відповідь' };
  }

  // Перевірити відповіді не-JSON для успішних відповідей
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    // Якщо відповідь HTML або інший формат не-JSON, журналювати для налагодження
    try {
      const text = await response.text();
      console.error('Non-JSON response received:', text ? text.substring(0, 500) : '(empty response)'); // Журналювати перші 500 символів
      
      // Включити URL, який не вдався, в повідомлення про помилку
      const url = response.url || 'unknown URL';
      throw new Error(`Неочікувана відповідь від сервера при запиті до ${url}. Перевірте консоль для деталей.`);
    } catch (textError) {
      console.error('Could not read response body');
      throw new Error('Не вдалося прочитати відповідь сервера');
    }
  }

  // Розібрати JSON відповідь
  try {
    return await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    throw new Error('Не вдалося розпарсити відповідь сервера');
  }
};

const ApiConfig = {
  API_BASE_URL,
  handleApiResponse
};

export default ApiConfig;
