import { defineConfig } from 'vite'

export default defineConfig({
  // Корневая папка проекта
  root: '.',

  // Настройки сервера разработки
  server: {
    port: 3000,
    open: true
  },

  // Настройки сборки
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },

  // Обработка статических файлов
  publicDir: 'assets'
})