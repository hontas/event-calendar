import moment from 'moment';
import assign from 'object-assign';
import { capitalize, range, isFunction } from './utils';

const evts = {
  INITIALIZED: 'initialized',
  WILL_RENDER: 'will-render',
  DID_RENDER: 'did-render',
  WILL_CHANGE_STATE: 'will-change-state',
  DID_CHANGE_MONTH: 'did-change-month'
};

const prefix = 'evt-calendar';
const errors = {
  SELECTOR_DID_NOT_MATCH: 'Selector did not match any element'
};

function eventCalender({ selector, locale, debug, tdTemplate, eventTemplate, state: initialState = {} }) {
  const _events = {};
  let el;
  let state;
  let table;
  let captionText;
  let tbody;
  let prev;
  let next;

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
    const previous = moment(state.currentTime).subtract(1, 'month');
    setState({
      currentTime: previous.valueOf()
    });
    emit(evts.DID_CHANGE_MONTH, previous.month());
  }

  function goToNextMonth() {
    const following = moment(state.currentTime).add(1, 'month');

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

  function render() {
    emit(evts.WILL_RENDER);

    const newTbody = createEl('tbody', { innerHTML: createMonth() });

    captionText.textContent = capitalize(moment(state.currentTime).format('MMMM'));

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
    const now = moment();
    const days = range(7)
      .map((i) => capitalize(now.weekday(i).format('dddd')))
      .map(thTmpl)
      .join('');

    return rowTmpl(days);
  }

  function createTableCell(day) {
    const events = state.events
      .filter((event) => {
        return moment(event.date).isSame(day.timestamp, 'day');
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
    const curr = moment(state.currentTime);
    const month = curr.month();
    const startDate = moment(curr).date(1).weekday(0);
    const currentDate = moment(startDate);
    const [lastMonth, nextMonth] = (function getNearbyMonths() {
      if (month === 0) {
        return [11, 1];
      }
      if (month === 11) {
        return [10, 0];
      }
      return [month - 1, month + 1];
    })();

    function isWithinCalendarRange(date) {
      const currentMonth = date.month();

      if (currentMonth === lastMonth || currentMonth === month) {
        return true;
      }

      if (currentMonth === nextMonth) {
        return !!date.weekday();
      }
    }

    while (isWithinCalendarRange(currentDate)) {
      days.push({
        dayOfMonth: currentDate.date(),
        timestamp: currentDate.valueOf(),
        isOtherMonth: currentDate.month() !== month
      });
      currentDate.add(1, 'day');
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

    const textContent = `${moment(event.date).format('HH:mm')} ${event.name}`;

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
  }

  function off(event, callback) {
    _events[event] = _events[event].filter((cb) => {
      return cb !== callback;
    });
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
    el = document.querySelector(selector);

    if (!el) {
      throw Error(errors.SELECTOR_DID_NOT_MATCH);
    }

    if (locale) {
      moment.locale(locale);
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
  return { render, setState, on, off };
}

export default eventCalender;

