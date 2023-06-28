# Базовый образ Node.js
FROM node:16-alpine

# Создаем директорию приложения в контейнере
WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm ci

# Копируем исходный код приложения в контейнер
COPY . .

# Устанавливаем переменные окружения
ENV PORT=3000
EXPOSE $PORT

# Запускаем команду при запуске контейнера
CMD [ "npm", "start" ]