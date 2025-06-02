import { parseCoordinates, loadPosts, savePosts, getLocation } from "./utils";

// Функция добавления поста в ленту и сохранения
function addPostToTimeline(content, latitude, longitude) {
  const posts = loadPosts();
  const now = new Date();

  const newPost = {
    content,
    latitude,
    longitude,
    date: now.toISOString(),
    id: now.getTime(), // Добавляем уникальный ID для каждого поста
  };

  // Добавляем новый пост в начало массива
  posts.unshift(newPost);
  savePosts(posts);

  // Очищаем ленту и перерисовываем все посты
  renderTimeline();
}

// Функция отрисовки всех постов
function renderTimeline() {
  const timeline = document.getElementById("timeline");
  const posts = loadPosts();

  // Полностью очищаем ленту перед отрисовкой
  timeline.innerHTML = "";

  if (posts.length === 0) {
    timeline.innerHTML = `
            <div class="empty-timeline">
                <i class="fas fa-wind"></i>
                <p>Ваша лента пока пуста. Создайте первую запись!</p>
            </div>
        `;
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.dataset.id = post.id; // Добавляем ID поста в DOM

    const postDate = new Date(post.date);
    const dateString = postDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const timeString = postDate.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    postElement.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">U</div>
                <div class="post-info">
                    <h3>Пользователь</h3>
                    <div class="post-date">${dateString} в ${timeString}</div>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-footer">
                <div class="post-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${post.latitude.toFixed(7)}, ${post.longitude.toFixed(7)}</span>
                </div>
            </div>
        `;

    timeline.append(postElement);
  });
}

// Создание поста с геолокацией
async function createPost() {
  const postContent = document.getElementById("post-content");
  const content = postContent.value.trim();

  if (!content) {
    alert("Пожалуйста, введите текст поста");
    return;
  }

  try {
    const location = await getLocation();
    addPostToTimeline(content, location.latitude, location.longitude);
    postContent.value = "";
  } catch (error) {
    console.log(error);
    const coordinatesInput = document.getElementById("coordinates-input");
    const coordinatesError = document.getElementById("coordinates-error");

    coordinatesInput.value = "";
    coordinatesError.style.display = "none";

    const coordinatesModal = document.getElementById("coordinates-modal");
    coordinatesModal.style.display = "flex";
  }
}

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
  const postContent = document.getElementById("post-content");
  const createPostBtn = document.getElementById("create-post");
  const coordinatesInput = document.getElementById("coordinates-input");
  const coordinatesError = document.getElementById("coordinates-error");
  const submitCoordinatesBtn = document.getElementById("submit-coordinates");
  const closeModalBtn = document.getElementById("close-modal");
  const coordinatesModal = document.getElementById("coordinates-modal");

  // Загружаем и отображаем посты при загрузке страницы
  renderTimeline();

  // Обработчики событий
  createPostBtn.addEventListener("click", createPost);

  postContent.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      createPost();
    }
  });

  closeModalBtn.addEventListener("click", () => {
    coordinatesModal.style.display = "none";
  });

  submitCoordinatesBtn.addEventListener("click", () => {
    try {
      const coords = parseCoordinates(coordinatesInput.value);
      coordinatesError.style.display = "none";
      coordinatesModal.style.display = "none";
      addPostToTimeline(
        postContent.value.trim(),
        coords.latitude,
        coords.longitude,
      );
      postContent.value = "";
    } catch (error) {
      coordinatesError.textContent = error.message;
      coordinatesError.style.display = "block";
    }
  });

  // Закрытие модального окна при клике вне его
  window.addEventListener("click", (e) => {
    if (e.target === coordinatesModal) {
      coordinatesModal.style.display = "none";
    }
  });
});
