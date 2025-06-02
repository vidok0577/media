// Функция для парсинга координат
export function parseCoordinates(input) {
  const cleanedInput = input.replace(/[\\[\]]/g, "");
  const parts = cleanedInput.split(",");

  if (parts.length !== 2) {
    throw new Error("Некорректный формат координат");
  }

  const latitude = parseFloat(parts[0].trim());
  const longitude = parseFloat(parts[1].trim());

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Координаты должны быть числами");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Широта должна быть между -90 и 90");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Долгота должна быть между -180 и 180");
  }

  return { latitude, longitude };
}

// Функция загрузки постов из localStorage
export function loadPosts() {
  const savedPosts = localStorage.getItem("timelinePosts");
  return savedPosts ? JSON.parse(savedPosts) : [];
}

// Функция сохранения постов в localStorage
export function savePosts(posts) {
  localStorage.setItem("timelinePosts", JSON.stringify(posts));
}

// Функция получения геолокации
export function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Геолокация не поддерживается вашим браузером");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject("Не удалось определить местоположение", error);
      },
    );
  });
}
