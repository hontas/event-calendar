# event-calendar

> Simple calendar for listing events [Demo: http://hontas.github.io/event-calendar](http://hontas.github.io/event-calendar/)

[![Dependency Status](https://david-dm.org/hontas/event-calendar.svg)](https://david-dm.org/hontas/event-calendar)
[![Dependency Status](https://david-dm.org/hontas/event-calendar/dev-status.svg)](https://david-dm.org/hontas/event-calendar#info=devDependencies)

## Install
```shell
npm install --save event-calendar
```

## Use
ES6 module
```js
import eventCalender from 'event-calender';

const cal = eventCalender({ selector: '.js-calender' });
```

Remember to include styles in your build-step `src/styles/main.styl`

As global
```html
<link rel="stylesheet" href="node_modules/event-calendar/dist/event-calendar.css">
<script src="node_modules/event-calendar/dist/event-calendar.min.js"></script>
<script>
    var cal = eventCalender({
        selector: '.js-calender',
        locale: 'sv',
        state: {
            events: [...],
            currentTime: Date.now()
        }
    });
</script>
```

### Options
- **selector** {String} DOM selector for container element - *required*
- **locale** {String} moment locale (you must supply locale-files yourself)
- **state** {Object}
    - **events** {Array} [...eventItems]
    - **currentTime** {Date | timestamp | Datestring with time}
- template functions - see below

### Event item interface
- **name** {String} required
- **date** {Date | Datestring | timestamp} required
- **link** {String url} optional

## API
- **render**
- **setState** (Object) [currentTime, events]
- **on** (event, callback) - subscribe to event
- **off** (event, callback) - unsubscribe to event

### Events
- **initialized**
- **will-render**
- **did-render**
- **will-change-state** {Object: newState}
- **did-change-month** {Number: month number}

```js
cal.on('will-change-state', function(newState) {
    //do something
});
```

### Template functions
Supply your own template functions to get custom markup

- **tdTemplate** {Function(day, events)} Returns html string    
    - **day** {Object} [dayOfMonth, timestamp, isOtherMonth]
    - **events** {Array} [...eventItems] or undefined
- **eventTemplate** {function(event)} Returns html string
    - **event** {eventItem}

```js
calendar({
  tdTmpl(day, events) {
    return `<td>${day.dayOfMonth}</td>`;
  }
});
```

## ToDo

- Events without link
- documentation fro es6 module and standalone
- remove moment JS dependancy...?
- Pluggable template functions
- gh-pages example
- remove webpack - simplify build/dev

## Change log
