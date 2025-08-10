'use strict';
import generationsData from './generationsData.js';
import {
  getRandomInt,
  addTextToElement,
  toggleActiveButton,
  rectangleRecipeChanger,
  printText,
  snapToEdge,
  changeTextElement,
} from './helpers.js';

// Получаем все элементы
const moodButtons = document.querySelectorAll('.generator__mood-button');
const recipientButtons = document.querySelectorAll(
  '.generator__recipient-button'
);
const colorButtons = document.querySelectorAll('.generator__color-button');
const difficultyTrack = document.querySelector('.generator__difficulty-track');
const difficultyButton = document.querySelector(
  '.generator__difficulty-button'
);
const difficultyText = document.querySelector('.generator__difficulty-text');
const submitBtn = document.querySelector('.generator__submit');

const SelectedOptions = {};
let newShare = {}; // Выносим в глобальную область видимости

// Обработчик кликов по документу
document.addEventListener('click', (event) => {
  const target = event.target;

  // Обработка кнопок получателя
  if (target.classList.contains('generator__recipient-button')) {
    toggleActiveButton(
      target,
      '.generator__recipient-button',
      'generator__recipient-button--active'
    );
    rectangleRecipeChanger(target.textContent);
  }

  // Обработака кнопки выбора сложности
  if (
    target.classList.contains('generator__difficulty-button') ||
    target.closest('.generator__difficulty-button')
  ) {
    console.log('difficultyButton');
  }

  // Обработка кнопок настроения
  if (
    target.classList.contains('generator__mood-button') ||
    target.closest('.generator__mood-button')
  ) {
    const moodButton = target.classList.contains('generator__mood-button')
      ? target
      : target.closest('.generator__mood-button');

    toggleActiveButton(
      moodButton,
      '.generator__mood-button',
      'generator__mood-button--active'
    );
    moodButtons.forEach((button) => {
      const span = button.querySelector('span');
      if (span) {
        span.remove();
      }
    });
    addTextToElement(moodButton, moodButton.getAttribute('data-text'));
  }

  // Обработка кнопок цвета
  if (target.classList.contains('generator__color-button')) {
    toggleActiveButton(
      target,
      '.generator__color-button',
      'generator__color-button--active'
    );
  }

  // Обработка кнопки сабмита
  if (target.classList.contains('generator__submit')) {
    const recipient = document.querySelector(
      '.generator__recipient-button--active'
    );
    const difficulty = document.querySelector('.generator__difficulty-button');
    const color = document.querySelector('.generator__color-button--active');
    const mood = document.querySelector('.generator__mood-button--active');

    // создаем и заполняем обьект данными
    const forFind = {
      recipient: recipient.dataset.base,
      complexity: difficulty.dataset.base,
      mood: mood.dataset.base,
    };
    // Находим нужный нам обьект в массиве данных
    newShare =
      generationsData.find((item) => {
        return (
          item.recipient === forFind.recipient &&
          item.complexity === forFind.complexity &&
          item.mood === forFind.mood
        );
      }) || console.log('не найдено');
    //  generationsData[getRandomInt(generationsData.length)]

    // Изменяем текст в элементах на нужный
    changeTextElement(
      document.querySelector('.generator__share-title'),
      newShare.title
    );
    changeTextElement(
      document.querySelector('.generator__share-text'),
      newShare.description
    );

    // Устанавливаем фоновое изображение в зависимости от выбранного цвета
    const share = document.querySelector('.generator__share');
    const colorName = color.dataset.base;

    // Определяем размер экрана для выбора правильной папки
    const isMobile = window.innerWidth <= 768;

    let imagePath = '';
    if (isMobile) {
      imagePath = `./assets/images/mobile/${colorName}.jpg`;
    } else {
      imagePath = `./assets/images/table/${colorName}.jpg`;
    }

    share.style.backgroundImage = `url(${imagePath})`;

    // Делаем видимфми данные
    document
      .querySelector('.generator__share-content')
      .classList.add('generator__share-content--visible');
    document
      .querySelector('.generator__share-popup')
      .classList.add('generator__share-popup--visible');
  }

  // Обработчик кнопки переключения "как сделать" и "вернуться к идее"
  if (target.classList.contains('generator__share-button')) {
    const button = document.querySelector('.generator__share-button');
    const title = document.querySelector('.generator__share-title');
    const content = document.querySelector('.generator__share-text');

    if (button.dataset.base === 'description') {
      changeTextElement(title, 'Как сделать?');
      changeTextElement(content, newShare.actions);
      changeTextElement(button, 'Вернуться к идее');
      button.dataset.base = 'actions';
    } else {
      changeTextElement(title, newShare.title);
      changeTextElement(content, newShare.description);
      changeTextElement(button, 'Как сделать');
      button.dataset.base = 'description';
    }
  }
});

// Функция drag & drop для ползунка
export function dragButton(track, button, text) {
  let trackRect = track.getBoundingClientRect();
  let isHorizontal = trackRect.width >= trackRect.height; // смотрим в какой сейчас плоскости наш элемент
  let minCoord = 0;
  let maxCoord = isHorizontal
    ? trackRect.width - button.offsetWidth
    : trackRect.height - button.offsetHeight;

  let isDragging = false; // Преременная по который мы понимаем что кнопка нажата нужном элементе
  let shift = 0; // Переменная учитывающая место нажатия на самой кнопке
  let newCoord = 0; // Новые координаты

  // обновляем данные позиционированная элекмента и макс координаты по оси
  function updateTrackRect() {
    trackRect = track.getBoundingClientRect();
    isHorizontal = trackRect.width >= trackRect.height;
    maxCoord = isHorizontal
      ? trackRect.width - button.offsetWidth
      : trackRect.height - button.offsetHeight;
  }

  // Сбросываем к min или max при ресайзе
  window.addEventListener('resize', () => {
    updateTrackRect();
    if (text.textContent === 'min') {
      if (isHorizontal) {
        button.style.left = '0px';
        button.style.top = '';
      } else {
        button.style.top = maxCoord + 'px';
        button.style.left = '';
      }
    } else {
      if (isHorizontal) {
        button.style.left = maxCoord + 'px';
        button.style.top = '';
      } else {
        button.style.top = '0px';
        button.style.left = '';
      }
    }
  });

  // Обрабатываем собитие мыши при нажатии
  if (button && track) {
    button.addEventListener('mousedown', (event) => {
      button.style.transition = '';
      event.preventDefault();
      isDragging = true;
      const buttonRect = button.getBoundingClientRect();
      shift = isHorizontal
        ? event.clientX - buttonRect.left
        : event.clientY - buttonRect.top;
      document.body.style.userSelect = 'none';
    });

    // Обрабатываем событие мыши при движении
    document.addEventListener('mousemove', (event) => {
      event.preventDefault();

      if (!isDragging) return;

      newCoord = isHorizontal
        ? event.clientX - trackRect.left - shift
        : event.clientY - trackRect.top - shift;

      // Выбираем новую координату с учетом максмальной и минимальной
      newCoord = Math.max(minCoord, Math.min(newCoord, maxCoord));
      if (isHorizontal) {
        const boxShadowMin = '0 -24px 12px #ABF59B';
        const boxShadowMax = '0 -24px 12px #B965FF';
        button.style.left = newCoord + 'px';
        if (newCoord > maxCoord / 2) {
          button.style.boxShadow = boxShadowMax;
        } else {
          button.style.boxShadow = boxShadowMin;
        }
      } else {
        const boxShadowMin = '0 -12px 12px #ABF59B';
        const boxShadowMax = '0 -12px 12px #B965FF';
        button.style.top = newCoord + 'px';
        if (newCoord > maxCoord / 2) {
          button.style.boxShadow = boxShadowMin;
        } else {
          button.style.boxShadow = boxShadowMax;
        }
      }
    });

    // Обрабатываем событие мыши при отпускании кнопки мыши
    document.addEventListener('mouseup', (e) => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = '';
        button.style.transition =
          (isHorizontal ? 'left' : 'top') + ' ease-in-out 0.3s';

        // "Прилипание" к ближайшему краю при отпускании кнопки
        snapToEdge(button, text, newCoord, maxCoord, isHorizontal);
      }
    });

    // Для мобильных устройств (touch events)
    button.addEventListener('touchstart', (event) => {
      button.style.transition = '';
      event.preventDefault();
      isDragging = true;
      const buttonRect = button.getBoundingClientRect();
      shift = isHorizontal
        ? event.touches[0].clientX - buttonRect.left
        : event.touches[0].clientY - buttonRect.top;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('touchmove', (event) => {
      event.preventDefault();
      if (!isDragging) return;
      let newCoord = isHorizontal
        ? event.touches[0].clientX - trackRect.left - shift
        : event.touches[0].clientY - trackRect.top - shift;
      newCoord = Math.max(minCoord, Math.min(newCoord, maxCoord));
      if (isHorizontal) {
        button.style.left = newCoord + 'px';
      } else {
        button.style.top = newCoord + 'px';
      }
    });

    document.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = '';
        button.style.transition =
          (isHorizontal ? 'left' : 'top') + ' ease-in-out 0.3s';
        snapToEdge(button, text, newCoord, maxCoord, isHorizontal);
      }
    });
  }
}

// Инициализация: устанавливаем случайные активные кнопки, если их нет
function initializeRandomButtons() {
  // Для кнопок получателя
  const activeRecipientButton = document.querySelector(
    '.generator__recipient-button--active'
  );
  if (!activeRecipientButton && recipientButtons.length > 0) {
    const randomRecipientButton =
      recipientButtons[getRandomInt(recipientButtons.length)];
    randomRecipientButton.classList.add('generator__recipient-button--active');

    rectangleRecipeChanger(randomRecipientButton.textContent);
  }

  // Для кнопок настроения
  const activeMoodButton = document.querySelector(
    '.generator__mood-button--active'
  );
  if (!activeMoodButton && moodButtons.length > 0) {
    const randomMoodButton = moodButtons[getRandomInt(moodButtons.length)];
    randomMoodButton.classList.add('generator__mood-button--active');
    addTextToElement(
      randomMoodButton,
      randomMoodButton.getAttribute('data-text')
    );
  }

  // Для ползунка сложности
  const difficultyText = document.querySelector('.generator__difficulty-text');
  let base = difficultyButton.dataset.base;
  let newCoord = null;
  if (base === '') {
    base = getRandomInt(2) > 0 ? 'Лёгкий' : 'Сложный';
    const isHorizontal =
      difficultyTrack.offsetWidth >= difficultyTrack.offsetHeight;
    const maxCoord = isHorizontal
      ? difficultyTrack.offsetWidth - difficultyButton.offsetWidth
      : difficultyTrack.offsetHeight - difficultyButton.offsetHeight;
    if (isHorizontal) {
      newCoord = base === 'Лёгкий' ? 0 : maxCoord;
    } else {
      newCoord = base === 'Лёгкий' ? maxCoord : 0;
    }
    snapToEdge(
      difficultyButton,
      difficultyText,
      newCoord,
      maxCoord,
      isHorizontal
    );
  }

  // Для кнопок цвета
  const activeColorButton = document.querySelector(
    '.generator__color-button--active'
  );
  if (!activeColorButton && colorButtons.length > 0) {
    const randomColorButton = colorButtons[getRandomInt(colorButtons.length)];
    randomColorButton.classList.add('generator__color-button--active');
  }
}

dragButton(difficultyTrack, difficultyButton, difficultyText);

// Запускаем инициализацию после загрузки DOM
document.addEventListener('DOMContentLoaded', initializeRandomButtons);
