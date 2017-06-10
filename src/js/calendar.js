import assign from 'object-assign';
import pkg from '../../package.json';
import { capitalize, range, isFunction, isString, date } from './utils';

const evts = {
  INITIALIZED: 'initialized',
  WILL_RENDER: 'will-render',
  DID_RENDER: 'did-render',
  WILL_CHANGE_STATE: 'will-change-state',
  DID_CHANGE_MONTH: 'did-change-month'
};

const prefix = 'evt-calendar';
const errors = {
  SELECTOR_DID_NOT_MATCH: 'Selector did not match any element',
  INVALID_SELECTOR: 'Must supply css-selector as string'
};

const lang = {
  en: {
    months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    startOfWeek: 0,
    twelveHourFormat: true
  },
  sv: {
    months: 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
    weekdays: 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
    startOfWeek: 1
  }
};

function eventCalendar({ selector, debug, tdTemplate, eventTemplate, locale: initLocale, i18n: userLang = {}, state: initialState = {} }) {
  let el;
  let state;
  let table;
  let captionText;
  let tbody;
  let prev;
  let next;
  let api;
  let locale = initLocale || 'en';
  const _events = {};
  const i18n = assign({}, lang, userLang, {
    getWeekDay(i) {
      const index = i + this.getWeekStart();
      return this[locale].weekdays[index > 6 ? 0 : index];
    },
    getMonth(i) {
      return this[locale].months[i];
    },
    getWeekStart() {
      return this[locale].startOfWeek;
    },
    isTwelveHours() {
      return this[locale].twelveHourFormat;
    }
  });

  function createDOM() {
    createTable();
    appendToDOM();
  }

  function appendToDOM() {
    el.classList.add(prefix + '__container');
    el.appendChild(table);
  }

  function createTable() {
    table = createEl('table', { className: prefix });
    const thead = createEl('thead');
    tbody = createEl('tbody');

    thead.innerHTML = createTableHead();
    table.appendChild(createCaptionWithControls());
    table.appendChild(thead);
    table.appendChild(tbody);
  }

  function createCaptionWithControls() {
    const caption = createEl('caption');
    createControls();
    captionText = createEl('div', { className: prefix + '__caption' });

    caption.appendChild(prev);
    caption.appendChild(next);
    caption.appendChild(captionText);

    return caption;
  }

  function createControls() {
    prev = createEl('button', { textContent: '<', className: prefix + '__prev-btn' });
    next = createEl('button', { textContent: '>', className: prefix + '__next-btn' });

    prev.addEventListener('click', goToPreviousMonth);
    next.addEventListener('click', goToNextMonth);
  }

  function month(value) {
    if (value) {
      const newMonth = date(state.currentTime).month(value - 1);
      setState({
        currentTime: newMonth.valueOf()
      });

      emit(evts.DID_CHANGE_MONTH, newMonth.month() + 1);
      return api;
    }

    return date(state.currentTime).month() + 1;
  }

  function goToPreviousMonth() {
    const previous = date(state.currentTime).subtractMonth();
    setState({
      currentTime: previous.valueOf()
    });
    emit(evts.DID_CHANGE_MONTH, previous.month());
  }

  function goToNextMonth() {
    const following = date(state.currentTime).addMonth();

    setState({
      currentTime: following.valueOf()
    });

    emit(evts.DID_CHANGE_MONTH, following.month());
  }

  function setState(newState) {
    emit(evts.WILL_CHANGE_STATE, newState);

    state = assign({}, state, newState);
    render();
  }

  function setLocale(str) {
    if (!isString(str) || str.length === 0) {
      throw Error('setLocale: Argument must be valid language string, eg en or sv');
    }

    locale = str;
    el.getElementsByTagName('thead')[0].innerHTML = createTableHead();
    render();
  }

  function render() {
    emit(evts.WILL_RENDER);

    const newTbody = createEl('tbody', { innerHTML: createMonth() });
    const currMonth = date(state.currentTime).month();
    const lastMonth = currMonth === 0 ? 11 : currMonth - 1;


    try {
      prev.textContent = '< ' + capitalize(i18n.getMonth(lastMonth));
      captionText.textContent = capitalize(i18n.getMonth(currMonth));
      next.textContent = capitalize(i18n.getMonth((currMonth + 1) % 12)) + ' >';
    } catch (e) {
      throw (new Error(lastMonth + e));
    }

    table.replaceChild(newTbody, tbody);
    tbody = newTbody;

    emit(evts.DID_RENDER);
  }

  function createEl(tag, options = {}) {
    const node = document.createElement(tag);
    Object.keys(options).forEach((key) => {
      node[key] = options[key];
    });
    return node;
  }

  function createTableHead() {
    const days = range(7)
      .map((i) => capitalize(i18n.getWeekDay(i)))
      .map(thTmpl)
      .join('');

    return rowTmpl(days);
  }

  function createTableCell(day) {
    const events = state.events
      .filter((event) => {
        return date(event.date).isSameDay(day.timestamp);
      })
      .sort((event1, event2) => {
        return new Date(event1.date).getTime() - new Date(event2.date).getTime();
      });

    return tdTmpl({ day, events });
  }

  function createTableRow(cell, i) {
    // insert a row before new week
    if (i % 7) {
      return cell;
    }

    return rowTmpl(cell);
  }

  function createMonth() {
    return createMonthArray()
      .map(createTableCell)
      .map(createTableRow)
      .join('');
  }

  function createMonthArray() {
    const days = [];
    const curr = date(state.currentTime);
    const startMonth = curr.month();
    const startDate = date(curr).date(1).weekday(i18n.getWeekStart());
    const currentDate = date(startDate);
    const [lastMonth, nextMonth] = (function getNearbyMonths() {
      if (startMonth === 0) {
        return [11, 1];
      }
      if (startMonth === 11) {
        return [10, 0];
      }
      return [startMonth - 1, startMonth + 1];
    })();

    function isWithinCalendarRange(date2compare) {
      const currentMonth = date2compare.month();

      if (currentMonth === lastMonth || currentMonth === startMonth) {
        return true;
      }

      if (currentMonth === nextMonth) {
        return date2compare.weekday() !== i18n.getWeekStart();
      }
    }

    while (isWithinCalendarRange(currentDate)) {
      days.push({
        dayOfMonth: currentDate.date(),
        timestamp: currentDate.valueOf(),
        isOtherMonth: currentDate.month() !== startMonth
      });
      currentDate.addDay();
    }

    return days;
  }

  function destroy(callback) {
    if (el) {
      // remove DOM
      let firstChild = el.firstChild;
      while (firstChild) {
        el.removeChild(firstChild);
        firstChild = el.firstChild;
      }

      // remove events
      Object.keys(_events).forEach((event) => {
        _events[event] = null;
      });

      // reset variables
      el = null;
      state = null;
      table = null;
      captionText = null;
      tbody = null;
      prev = null;
      next = null;
      api = null;
    }

    if (isFunction(callback)) {
      callback();
    }
  }

  /**
   * Template functions
   */

  function rowTmpl(cells) {
    return `<tr>${cells}`;
  }

  function thTmpl(day) {
    return (
      `<th class="${prefix}__head">
        ${day.substr(0, 1)}<span class="rest">${day.substr(1, 2)}<span class="ending">${day.substr(3)}</span><span>
      </th>`);
  }

  function eventTmpl(event) {
    if (isFunction(eventTemplate)) {
      return eventTemplate(event);
    }

    const textContent = `${date(event.date).time(i18n.isTwelveHours())} ${event.name}`;
    const tag = event.link ? 'a' : 'span';
    const link = event.link ? 'href="' + event.link + '"' : '';

    return (
      `<${tag} class="${prefix}__cell__event" ${link} title="${textContent}">
        <span class="event-time">${date(event.date).time(i18n.isTwelveHours())}</span>
        <span class="event-name">${event.name}</span>
        <span class="event-dot"></span>
      </${tag}>`);
  }

  function tdTmpl({ day, events }) {
    if (isFunction(tdTemplate)) {
      return tdTemplate({ day, events });
    }

    const active = events.length ? prefix + '__cell--active' : '';
    const passive = day.isOtherMonth ? prefix + '__cell--passive' : '';
    const links = events.map(eventTmpl).join('');

    return (
      `<td class='${prefix}__cell ${active} ${passive}'>
        ${ links }
        <span class='${prefix}__cell__date'>${day.dayOfMonth}</span>
      </td>`);
  }

  /**
   * Events
   */

  function on(event, callback) {
    if (!_events[event]) {
      _events[event] = [];
    }
    _events[event] = [..._events[event], callback];

    return api;
  }

  function off(event, callback) {
    _events[event] = _events[event].filter((cb) => {
      return cb !== callback;
    });

    if (_events[event].length === 0) {
      delete _events[event];
    }

    return api;
  }

  function emit(event, data) {
    if (_events[event]) {
      _events[event].forEach((cb) => cb(data));
    }
  }

  /**
   * Init
   */

  function init() {
    if (!selector || !isString(selector)) {
      throw Error(errors.INVALID_SELECTOR);
    }

    el = document.querySelector(selector);

    if (!el) {
      throw Error(errors.SELECTOR_DID_NOT_MATCH);
    }

    if (debug) {
      on(evts.WILL_RENDER, () => { console.time('render'); }); // eslint-disable-line no-console
      on(evts.DID_RENDER, () => { console.timeEnd('render'); }); // eslint-disable-line no-console
    }

    state = assign({}, {
      currentTime: Date.now(),
      events: []
    }, initialState);

    createDOM();
    render();
    emit(evts.INITIALIZED);
  }

  /**
   * Export Public API
   */

  init();
  api = {
    render,
    setState,
    setLocale,
    month,
    on,
    off,
    destroy,
    _events
  };

  return api;
}

eventCalendar.version = pkg.version;

export default eventCalendar;

