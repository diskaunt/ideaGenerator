// Функция для получения случайного числа от 0 до max
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Функция для добавления текста к кнопке настроения
export function addTextToElement(button, newText) {
  // Создаём новый span для активной кнопки
  const span = document.createElement('span');
  span.style.textAlign = 'center';
  span.style.width = '100%';
  span.style.overflow = 'hidden';
  span.textContent = newText;
  button.appendChild(span);
}

export function changeTextElement(element, newText) {
  if (Boolean(newText)) {
    element.innerHTML = newText;
  }
}

// Функция для "прилипания" к краям
export function snapToEdge(button, text, newCoord, maxCoord, isHorizontal) {
  if (isHorizontal) {
    const boxShadowMin = '0 -24px 12px #ABF59B';
    const boxShadowMax = '0 -24px 12px #B965FF';
    if (newCoord > maxCoord / 2) {
      button.style.left = maxCoord + 'px';
      button.style.boxShadow = boxShadowMax;
      text.textContent = 'max';
      button.dataset.base = 'Сложный';
    } else {
      button.style.left = '0px';
      button.style.boxShadow = boxShadowMin;
      text.textContent = 'min';
      button.dataset.base = 'Лёгкий';
    }
  } else {
    const boxShadowMin = '0 -12px 12px #ABF59B';
    const boxShadowMax = '0 -12px 12px #B965FF';
    if (newCoord < maxCoord / 2) {
      button.style.top = '0px';
      button.style.boxShadow = boxShadowMax;
      text.textContent = 'max';
      button.dataset.base = 'Сложный';
    } else {
      button.style.top = maxCoord + 'px';
      button.style.boxShadow = boxShadowMin;
      text.textContent = 'min';
      button.dataset.base = 'Лёгкий';
    }
  }

  // Проверяем изменения параметров после изменения сложности
  // Создаем событие для уведомления об изменении сложности
  // const changeEvent = new CustomEvent('difficultyChanged');
  // document.dispatchEvent(changeEvent);
}

// функция изменяющая текст в окне в зависимости от выбранного человека
export function rectangleRecipeChanger(newText) {
  const recipientRectagleText = document.querySelector(
    '.generator__recipient-rectangle-text'
  );
  if (recipientRectagleText) {
    switch (newText) {
      case 'Коллеги':
        recipientRectagleText.innerHTML = 'Сканируем офисные будни|';
        break;
      case 'Партнер':
        recipientRectagleText.innerHTML = 'Запущена программа ROMANTIKA|';
        break;
      case 'Семья':
        recipientRectagleText.innerHTML = 'Уровень тепла настроен на 100%|';
        break;
      case 'Друзья':
        recipientRectagleText.innerHTML = 'Анализируем весёлые воспоминания|';
        break;
      default:
        recipientRectagleText.innerHTML = '...|';
    }

    printText(recipientRectagleText, 50);
  }
}

// функция имитирующая печатную машинку
export function printText(el, timeout) {
  // Останавливаем предыдущую анимацию если она есть
  if (el.printTimeout) {
    clearTimeout(el.printTimeout);
  }

  let letterTimeout = timeout;
  let text = el.innerHTML;
  let i = 1;

  print__fn(); // init

  function print__fn() {
    if (i <= text.length) {
      el.innerHTML = text.substr(0, i);
      // Сохраняем timeout ID для возможности остановки
      el.printTimeout = setTimeout(print__fn, letterTimeout);
    }
    i++;
  }
}

// Функция для переключения активного состояния кнопок
export function toggleActiveButton(clickedButton, buttonSelector, activeClass) {
  // Убираем активный класс у всех кнопок этого типа
  document.querySelectorAll(buttonSelector).forEach((button) => {
    button.classList.remove(activeClass);
  });

  // Добавляем активный класс к нажатой кнопке
  clickedButton.classList.add(activeClass);
}

// Функция для получения текущих выбранных параметров
export function getCurrentOptions() {
  const recipient = document.querySelector(
    '.generator__recipient-button--active'
  );
  const difficulty = document.querySelector('.generator__difficulty-button');
  const color = document.querySelector('.generator__color-button--active');
  const mood = document.querySelector('.generator__mood-button--active');

  return {
    recipient: recipient ? recipient.dataset.base : null,
    complexity: difficulty ? difficulty.dataset.base : null,
    color: color ? color.dataset.base : null,
    mood: mood ? mood.dataset.base : null,
  };
}
