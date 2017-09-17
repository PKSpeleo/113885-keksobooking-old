// setup.js
'use strict';

// Количество объявлений
var adsQuantity = 8;

// Объявляем массив объявлений
var ads = [];

// Здесь храгим данные для генерации объявлений
var variantsOfTitle = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный ' +
'прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый ' +
'негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var variantsOfPriceMin = 1000;
var variantsOfPriceMax = 1000000;
var variantsOfType = ['flat', 'house', 'bungalo'];
var variantOfRoomsMin = 1;
var variantOfRoomsMax = 5;
var variantsOfGuestsMin = 1;
var variantsOfGuestsMax = 10;
var variantsOfCheckinCheckout = ['12:00', '13:00', '14:00'];
var variantsOfLocationXMin = 300;
var variantsOfLocationXMax = 900;
var variantsOfLocationYMin = 100;
var variantsOfLocationYMax = 500;
var variantsOfFeature = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

// Смещения для нахождения кончика метки
var mapMarkerXOffset = 28; // 56 - ширина, делим на два 28. Но получается кончик смещается на 1рх - это номр?
var mapMarkerYOffset = 75;

// Генерируем случайнео целое число от минимума до максимума
var randomIntegerMinToMax = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция выбора случайных элеменов массива
var chooseRandomArrElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Функция урезания массива
var generateFeatures = function (arr) {
  return arr.slice(0, randomIntegerMinToMax(0, arr.length));
};


// Создаем массив случайных объявлений
for (var i = 0; i < adsQuantity; i++) {
  ads[i] = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    },
    offer: {
      title: variantsOfTitle[i],
      address: '',
      price: randomIntegerMinToMax(variantsOfPriceMin, variantsOfPriceMax),
      type: chooseRandomArrElement(variantsOfType),
      rooms: randomIntegerMinToMax(variantOfRoomsMin, variantOfRoomsMax),
      guests: randomIntegerMinToMax(variantsOfGuestsMin, variantsOfGuestsMax),
      checkin: chooseRandomArrElement(variantsOfCheckinCheckout),
      checkout: chooseRandomArrElement(variantsOfCheckinCheckout),
      features: generateFeatures(variantsOfFeature),
      description: '',
      photos: []
    },
    location: {
      x: randomIntegerMinToMax(variantsOfLocationXMin, variantsOfLocationXMax),
      y: randomIntegerMinToMax(variantsOfLocationYMin, variantsOfLocationYMax)
    }
  };
  ads[i].offer.address = ads[i].location.x + ', ' + ads[i].location.y;
}


// Создаем и заполняем DOM элемент

// Функция генерации фрагмента
var createMapMarkerElement = function (arr, offsetX, offsetY) {
  var newElement = document.createElement('div');
  newElement.className = 'pin';
  newElement.style.left = (arr.location.x - offsetX) + 'px';
  newElement.style.top = (arr.location.y - offsetY) + 'px';
  newElement.innerHTML = '<img src="' + arr.author.avatar + '" class="rounded" width="40" height="40">';
  return newElement;
};

// Создаем фрагмент для оптимизации
var mapMarkerFragment = document.createDocumentFragment();

// Генерируем фрагмент
for (var j = 0; j < adsQuantity; j++) {
  mapMarkerFragment.appendChild(createMapMarkerElement(ads[j], mapMarkerXOffset, mapMarkerYOffset));
}

// Находим куда рисовать
var mapMarker = document.querySelector('.tokyo__pin-map');

// Отрисовываем фрагмент там, где надо;)
mapMarker.appendChild(mapMarkerFragment);

var translateOfferType = function (offerType) {
  if (offerType === 'flat') {
    return 'Квартира';
  } else if (offerType === 'bungalo') {
    return 'Бунгало';
  } else if (offerType === 'house') {
    return 'Дом';
  } else {
    return 'Незивестно что';
  }
};

// Используем шаблон
var similarLodgeTemplate = document.querySelector('#lodge-template').content;

// функция генерации фич
var generateFeatureSpan = function (arr) {
  var newElement = document.createElement('span');
  newElement.className = 'feature__image feature__image--' + arr;
  return newElement;
};

// Функция геренарции фрагмента
var createDialogPanelFragment = function (arr) {
  var element = similarLodgeTemplate.cloneNode(true);
  element.querySelector('.lodge__title').textContent = arr.offer.title;
  element.querySelector('.lodge__address').textContent = arr.offer.address;
  element.querySelector('.lodge__price').textContent = arr.offer.price + '₽/ночь';
  element.querySelector('.lodge__type').textContent = translateOfferType(arr.offer.type);
  element.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + arr.offer.guests + ' гостей в ' +
    arr.offer.rooms + ' комнатах';
  element.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + arr.offer.checkin +
    ', выезд до ' + arr.offer.checkout;
  for (var k = 0; k < arr.offer.features.length; k++) {
    element.querySelector('.lodge__features').appendChild(generateFeatureSpan(arr.offer.features[k]));
  } // голову сломал, как вынести это в отдельную функцию, буду благодарен за подсказку
  element.querySelector('.lodge__description').textContent = arr.offer.description;
  return element;
};


// Создаем фрагмент для оптимизации
var dialogPanelFragment = document.createDocumentFragment();

// Генерируем фрагмент
dialogPanelFragment.appendChild(createDialogPanelFragment(ads[0]));

// Заменяем диалог на фрагмент
var dialogPanel = document.querySelector('.dialog__panel');
dialogPanel.parentNode.replaceChild(dialogPanelFragment, dialogPanel);

// Меняе SRC....
document.querySelector('.dialog__title').getElementsByTagName('img')[0].src = ads[0].author.avatar;

// Поехали 1 2 4 5
