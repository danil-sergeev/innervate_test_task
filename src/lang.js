/**
 * Сервис предоставляющий информацию о текущем языке интерфейса.
 */

import QueryString from 'query-string'

let listeners = [];

const DEFAULT_LANG = 'ru'; // Можно ставить язык, указанный как предпочтительный пользователем.  Но тогда его надо определять на сервер по header запроса

const isLocalStorage = !!window.localStorage;

let lang = (isLocalStorage ? localStorage.getItem('lang') : null) || DEFAULT_LANG;

/**
 * Подписка на событие по смене языка.
 *
 * @param listener - метод вызываемый при изменении текущего языка.
 */
function listen(listener = throwIfMissing('listener')) {
  listeners.push(listener);
  return function () {
    let i = listeners.indexOf(listener);
    if (i > 0) listeners.splice(i, 1);
  }
}

/**
 * Присвоение текущего языка отображения.  Если язык отличается от того, который был раньше об изменении оповещаются
 * все слушатели, подписавшиеся через метод listen.
 *
 * Для работы с react-router, в качестве парметра можно передавать объект browserHistory, тогда язык будет браться из
 * location.query.lang, если параметр указан.
 *
 * @param value - Значение языка интерфейса ('en' - английский, 'ru' - русский).
 */
export function setLang(value = throwIfMissing('value')) {
  if (typeof value == 'object') { // it's router location object
    const query = QueryString.parse(value.search);
    if (!Object.prototype.hasOwnProperty.call(query, 'lang')) return;
    value = query.lang;
  }
  if (value == lang) return;
  lang = value;
  if (isLocalStorage) localStorage.setItem('lang', lang);
  listeners.forEach(function (lst) {
    lst(value);
  });
}

export function switchLang(ev) {
  if (ev) ev.preventDefault();
  setLang(lang == 'ru' ? 'en' : 'ru');
}

export const Mixin = {

  getInitialState() {
    return {
      lang: lang,
    };
  },

  componentWillMount() {
    this._langUnsub = listen((value) => {
      this.setState({lang: value});
    });
  },

  componentWillUnmount() {
    this._langUnsub();
  }
};

/**
 * Возвращает функцию, которая на основании переданной таблицы локализации, возвращает текстовое значение.
 *
 * При этом если для данного языка значения нет, то как значение по умолчанию используется первое значение указанное
 * для данного ключа.
 *
 * @param i18n
 * @returns {langFunc}
 */
export default function(i18n) {
  function langFunc(key) {
    if (i18n.hasOwnProperty(lang)) {
      console.warn(`Missing l18n key: ${key}`); // ругаемся, возвращаем исходный ключ
      return key;
    }
    let loc = i18n[key];
    if (loc) {
      if (loc.hasOwnProperty(lang)) // возвращаем значения, для текущего языка
        return loc[lang];
      for (let k in loc) // возвращаем первое значение по списку
        return loc[k];
    }
    console.warn(`Has no values l18n key: ${key}`); // ругаемся, возвращаем исходный ключ
    return key;
  }

  // для красоты кода, вешаем расширения прямо на функцию
  langFunc.Mixin = Mixin;
  langFunc.setLang = setLang;
  langFunc.switchLang = switchLang;
  return langFunc;
}



