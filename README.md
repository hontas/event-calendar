# event-calendar

> Simple calendar for listing events Demo: [http://hontas.github.io/event-calendar](http://hontas.github.io/event-calendar/)

[![Dependency Status](https://david-dm.org/hontas/event-calendar.svg)](https://david-dm.org/hontas/event-calendar)
[![Dependency Status](https://david-dm.org/hontas/event-calendar/dev-status.svg)](https://david-dm.org/hontas/event-calendar#info=devDependencies)
[![Build Status](https://travis-ci.org/hontas/event-calendar.svg)](https://travis-ci.org/hontas/event-calendar)

## Install
```shell
npm install --save event-calendar
# or
bower install --save evt-calendar
```

## Use
### ES6 module
```js
import eventCalender from 'event-calender';
eventCalender({ selector: '.js-calender' });
```

Remember to include styles in your build-step from `src/styles/event-calendar.styl`

### In browser
```html
<link href="bower_components/event-calendar/dist/event-calendar.css" rel="stylesheet">
<script src="bower_components/event-calendar/dist/event-calendar.min.js"></script>
<script>
  eventCalender({ selector: '.js-calender' });
</script>
```

### Options
- **selector** {String} DOM selector for container element - *required*
- **state** {Object}
    - **events** {Array} Array of event items
    - **currentTime** {Date | timestamp | datestring } Start date - defaults to *Date.now()*
- **i18n** {Object} Object containing dictionaries - see below
- **locale** {String} What locale to use, defaults to 'en'
- **tdTemplate** {Function(day, events)} Should return html string    
    - **day** {Object} [dayOfMonth, timestamp, isOtherMonth]
    - **events** {Array | Undefined} [...eventItems]
- **eventTemplate** {function(event)} Should return html string
    - **event** {eventItem} [name, date, link]

```js
evtCalendar({
  selector: '.js-evt-cal',
  state: {
    events: [{ name: 'test', date: Date.now() }],
    currentTime: Date.now()
  },
  i18n: {}, // see example below
  locale: 'sv',
  tdTemplate: function({ day, events }) { return ""; },
  eventTemplate: function(event) { return event.name; }
})
  .on('did-render', function() {})
  .on('will-change-state', function(newState) {});
```

### Calendar Events interface
```js
var events = [
  {
    name: {String}, // required
    date: {Date | timestamp | Datestring}, // required
    link: {String}
  }
];
```

## API
- **render**
- **setState** (Object) [currentTime and/or events]
- **on** (event, callback) - subscribe to event
- **off** (event, callback) - unsubscribe to event
- **month** (optional value) - get / set month (non-zero-based)
- **destroy** - removes itself from DOM

### static
- **version** (String) - current version

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
Supply your own template functions to for custom markup

```js
calendar({
  tdTmpl(day, events) {
    return `<td>${day.dayOfMonth}</td>`;
  }
});
```

### i18n
English and Swedish are available of the bat for months and days of the week.  
Add your own like this:
```js
eventCalendar({
    i18n: {
        no: {
            months: ['januar', 'ferbruar', ...],
            weekdays: ['mornda', 'tirsda', ...],
            startOfWeek: 0, // 0 = sunday, 1 = monday
            twelveHourFormat: true // optional
        }
    },
    locale: 'no'
});
```
That will add 'no' translations to the i18n dictionary and `locale: 'no'` will set the locale.

You may also use the method `setLocale('no')` to change locale whenever you wish. This will cause a re-render.

## Deploy
Run `npm run major` to publish new major version  
Run `npm run minor` to publish new minor version  
Run `npm run patch` to publish new version patch

These tasks will

1. bump version
2. build to dist
3. publish to npmjs
4. deploy dist to gh-pages branch
5. push new git-tags

## ToDo
- create react component
- create jquery plugin

## Change log

### 0.8.1
- render previous and next month name

### 0.7.0
- expose method destroy, to remove itself from the DOM
- expose method month, to get and set normalized month (non-zero-based)
- added integration tests

### 0.6.5
- 12 hour time format support

### 0.6.4
- Responsive layout

### 0.6.1
- removed moment.js dependancy

### 0.4.5
- Events without link
- improved documentation
- Pluggable template functions (tdTemplate & eventTemplate)
- gh-pages demo
