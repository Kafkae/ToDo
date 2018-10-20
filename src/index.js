/* global document */
/* global XMLHttpRequest */
/* global fetch */


// Ипорты и перемаенныe связанные с firebase

// import firebase from 'firebase';

import initfire from './scripts/fireback/initfire';

initfire();


// DOM

const page = document.querySelector('.page');

// форма

const form = document.querySelector('.addtask');
const title = document.querySelector('.addtask__title-input');
const type = document.querySelector('.addtask__type-select');
const descr = document.querySelector('.addtask__descr-field');
const rng = document.querySelector('.addtask__hard-range-val');
const rngField = document.querySelector('.addtask__hard-range-field');
const go = document.querySelector('.addtask__go');

// url бд
const fireURL = 'https://todotest-a7dd7.firebaseio.com/.json';

// показать задания

const root = document.querySelector('.alltask');

// Показываем див на 2.5 секунды и очищаем форму если все отправилось
function finished() {
  form.reset();
  const popupFin = document.createElement('div');
  popupFin.innerHTML = 'Задание отправлено !';
  popupFin.className = 'fineshed-popup';
  page.appendChild(popupFin);
  setTimeout(() => {
    popupFin.parentNode.removeChild(popupFin);
  }, 2500);
  go.value = 'Ок';
  go.disabled = false;
  go.style.cursor = 'pointer';
}

// а этот див если ничего не отправилось :(

function fail() {
  const popupFail = document.createElement('div');
  popupFail.innerHTML = 'Задание не отправлено !';
  popupFail.className = 'fail-popup';
  page.appendChild(popupFail);
  setTimeout(() => {
    popupFail.parentNode.removeChild(popupFail);
  }, 2500);
  go.value = 'Ок';
  go.disabled = false;
  go.style.cursor = 'pointer';
}

// промис чтобы отправить задание
function dispatchPost() {
  return new Promise(((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', fireURL, true);
    xhr.onload = resolve;
    xhr.onerror = reject;
    // показываем пользователю что дпнные отправляются
    xhr.onloadstart = function block() {
      go.value = 'Загрузка';
      go.disabled = true;
      go.style.cursor = 'no-drop';
    };
    xhr.send(JSON.stringify({
      titleName: title.value,
      descrName: descr.value,
      typeName: type.value,
      rngFieldName: rngField.value,
    }));
  }));
}

// валадиция с помошью нативного js API - Constraint Validation

// Удаляем стандартную валидацию

for (let i = 0; i < form.length; i += 1) {
  form[i].setAttribute('novalidate', true);
}
form.noValidate = true;

// определаяем правила для формы и пишете как им следовать
const hasError = function checkErr(field) {
  const { validity } = field;
  if (validity.valid) return '';
  if (validity.valueMissing) return 'Заполните это поле';

  if (validity.typeMismatch) {
    if (field.type === 'email') return 'Пожалуйста введите адрес электронной почты';
  }
  if (validity.tooShort) return `Необходимо ${field.getAttribute('minLength')} символов. Сейчас ${field.value.length}`;

  if (validity.tooLong) return `Слишком много символов - ${field.getAttribute('maxLength')}. Сейчас ${field.value.length}`;

  return 'Значение, введенное для этого поля, неверно.';
};

// показываем ошибку

const showError = function showErrorFunc(field, error) {
  field.classList.add('error');

  const id = field.id || field.name;
  if (!id) return;

  let message = field.form.querySelector(`.error-message#error-for-${id}`);
  if (!message) {
    message = document.createElement('div');
    message.className = 'error-message';
    message.id = `error-for-${id}`;
    field.parentNode.insertBefore(message, field.nextSibling);
  }


  message.innerHTML = error;

  message.style.display = 'block';
  message.style.visibility = 'visible';
};

// а тут удаляем, если все хорошо
const removeError = function removeErrorFunc(field) {
  field.classList.remove('error');

  const id = field.id || field.name;
  if (!id) return;

  const message = field.form.querySelector(`.error-message#error-for-${id}`);
  if (!message) return;

  message.innerHTML = '';
  message.style.display = 'none';
  message.style.visibility = 'hidden';
};

// проверяем после каждого ввода поля
document.addEventListener('blur', (event) => {
  if (!event.target.form.classList.contains('validate')) return;

  const error = hasError(event.target);
  if (error) {
    showError(event.target, error);
    return;
  }
  removeError(event.target);
}, true);


// а тут финальная проверка и отправка
document.addEventListener('submit', (event) => {
  if (!event.target.classList.contains('validate')) return;

  const fields = event.target.elements;

  let error;
  let hasErrors;
  for (let i = 0; i < fields.length; i += 1) {
    error = hasError(fields[i]);
    if (error) {
      showError(fields[i], error);
      if (!hasErrors) {
        hasErrors = fields[i];
      }
    }
  }

  if (hasErrors) {
    hasErrors.focus();
    event.preventDefault();
    return;
  }
  event.preventDefault();

  dispatchPost()
    .then(() => { finished(); })
    .catch(() => { fail(); });
}, false);

rng.oninput = function func() {
  rngField.value = rng.value;
};

// показываем данные

function json(response) {
// получаем json
  return response.json();
}

function setting(response) {
// делаем из json массив и переворачиваем его, чтобы задания шли с самого последнего
  const data = response;
  const qwt = [];
  Object.keys(data)
    .sort()
    .reverse()
    .forEach((key) => {
      qwt.push({
        data: data[key],
      });
    });

  return qwt;
}

function showData(qwt) {
  qwt.forEach((hotel) => {
    const elem = document.createElement('article');
    elem.className = 'alltask__part';
    elem.innerHTML = `<h2 class='alltask__title'>${hotel.data.titleName}</h2> 
<span class='alltask__type'> Тип: ${hotel.data.typeName}</span> 
<p class='alltask__descr'>${hotel.data.descrName}</p> 
<span class='alltask__hard'> Сложность: ${hotel.data.rngFieldName} из 5</span>`;
    root.appendChild(elem);
  });
}

fetch(fireURL, {
  method: 'GET',
})
  .then(json)
  .then(setting)
  .then(showData);
