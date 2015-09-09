# event-calendar

> Simple calendar for listing events [Demo: http://hontas.github.io/event-calendar](http://hontas.github.io/event-calendar/)

[![Dependency Status](https://david-dm.org/hontas/event-calendar.svg)](https://david-dm.org/hontas/event-calendar)
[![Dependency Status](https://david-dm.org/hontas/event-calendar/dev-status.svg)](https://david-dm.org/hontas/event-calendar#info=devDependencies)

## Install
### Node
```shell
npm install --save event-calendar
```

### Bower
```shell
bower install --save evt-calendar
```

## Use
### ES6 module
ES6 module
```js
import eventCalender from 'event-calender';

eventCalender({ selector: '.js-calender' });
```

Remember to include styles in your build-step `src/styles/main.styl`

### Global
```html
<link href="bower_components/event-calendar/dist/event-calendar.css" rel="stylesheet">
<script src="bower_components/event-calendar/dist/event-calendar.min.js"></script>
<script>
  eventCalender({ selector: '.js-calender' });
</script>
```

### Options
- **selector** {String} DOM selector for container element - *required*
- **momentLocale** {String} - remember to load locale-files before
- **state** {Object}
    - **events** {Array} [...eventItems]
    - **currentTime** {Date | timestamp | Datestring}
- template functions - see below

```js
evtCalendar({
  selector: '.js-evt-cal',
  momentLocale: 'sv', // remember to load locale-file before
  state: {
    events: [{ name: 'test', date: Date.now() }],
    currentTime: Date.now()
  },
  tdTemplate: function({ day, events }) { return ""; },
  eventTemplate: function(event) { return event.name"; }
})
  .on('did-render', function() {})
  .on('will-change-state', function() {});
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

## Deploy
Run `npm run major` to publish new major version
Run `npm run minor` to publish new minor version
Run `npm run patch` to publish new version patch

These tasks will:
1. bump version
2. build to dist
3. publish to npmjs
4. deploy dist to gh-pages branch
5. push new git-tags

## ToDo

- remove moment JS dependancy...?

## Change log

### 0.4.5
- Events without link
- improved documentation
- Pluggable template functions (tdTemplate & eventTemplate)
- gh-pages demo