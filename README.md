# event-calendar

> Simple calendar for listing events Demo: [http://hontas.github.io/event-calendar](http://hontas.github.io/event-calendar/)

[![Dependency Status](https://david-dm.org/hontas/event-calendar.svg)](https://david-dm.org/hontas/event-calendar)
[![Dependency Status](https://david-dm.org/hontas/event-calendar/dev-status.svg)](https://david-dm.org/hontas/event-calendar#info=devDependencies)

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
- **momentLocale** {String} moment locale setting
- **state** {Object}
    - **events** {Array} Array of event items
    - **currentTime** {Date | timestamp} Start date - defaults to *Date.now()*
- **tdTemplate** {Function(day, events)} Should return html string    
    - **day** {Object} [dayOfMonth, timestamp, isOtherMonth]
    - **events** {Array | Undefined} [...eventItems]
- **eventTemplate** {function(event)} Should return html string
    - **event** {eventItem} [name, date, link]

```js
evtCalendar({
  selector: '.js-evt-cal',
  momentLocale: 'sv', // remember to load locale-file before
  state: {
    events: [{ name: 'test', date: Date.now() }],
    currentTime: Date.now()
  },
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
- remove moment.js dependancy...?
- create react component
- create jquery plugin

## Change log

### 0.4.5
- Events without link
- improved documentation
- Pluggable template functions (tdTemplate & eventTemplate)
- gh-pages demo