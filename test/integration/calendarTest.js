describe('calendar', () => {
  var selector = '.js-evt-cal';
  var datestring = '2015-04-27 09:00';

  before(() => {
    var div = document.createElement('div');
    div.className = selector.slice(1);
    document.body.appendChild(div);
  });

  beforeEach(() => {
    eventCalendar({
      selector: selector,
      state: {
        currentTime: datestring
      }
    });
  });

  afterEach(() => {
    console.log('after each');
  });

  it('should do something', () => {
    expect(true).to.equal(false);
  });
});
