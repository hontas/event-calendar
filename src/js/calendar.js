import assign from 'object-assign';
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
    startOfWeek: 0
  },
  sv: {
    months: 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
    weekdays: 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
    startOfWeek: 1
  }
};

function eventCalendar({ selector, debug, tdTemplate, eventTemplate, locale = 'en', i18n: userLang = {}, state: initialState = {} }) {
  let el;
  let state;
  let table;
  let captionText;
  let tbody;
  let prev;
  let next;
  let api;
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
    locale = str;
    render();
  }

  function render() {
    emit(evts.WILL_RENDER);

    const newTbody = createEl('tbody', { innerHTML: createMonth() });

    captionText.textContent = capitalize(i18n.getMonth(date(state.currentTime).month()));

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
    const month = curr.month();
    const startDate = date(curr).date(1).weekday(i18n.getWeekStart());
    const currentDate = date(startDate);
    const [lastMonth, nextMonth] = (function getNearbyMonths() {
      if (month === 0) {
        return [11, 1];
      }
      if (month === 11) {
        return [10, 0];
      }
      return [month - 1, month + 1];
    })();

    function isWithinCalendarRange(date2compare) {
      const currentMonth = date2compare.month();

      if (currentMonth === lastMonth || currentMonth === month) {
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
        isOtherMonth: currentDate.month() !== month
      });
      currentDate.addDay();
    }

    return days;
  }

  /**
   * Template functions
   */

  function rowTmpl(cells) {
    return `<tr>${cells}`;
  }

  function thTmpl(day) {
    return `<th>${day}</th>`;
  }

  function eventTmpl(event) {
    if (isFunction(eventTemplate)) {
      return eventTemplate(event);
    }

    const textContent = `${date(event.date).time()} ${event.name}`;

    if (event.link) {
      return (
        `<a class="${prefix}__cell__event" href="${event.link}">
          ${textContent}
        </a>`);
    }

    return (
      `<span class="${prefix}__cell__event">
        ${textContent}
      </span>`);
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
      on(evts.WILL_RENDER, () => { console.time('render'); });
      on(evts.DID_RENDER, () => { console.timeEnd('render'); });
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
  api = { render, setState, setLocale, on, off };
  return api;
}

export default eventCalendar;
