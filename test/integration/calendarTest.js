describe('calendar', () => {
  var selector = '.js-evt-cal';
  var datestring = '2015-04-27T09:00';
  var container;
  var cal;

  function getEls(selector) {
    var els = [].slice.call(container.querySelectorAll(selector));
    els.first = els[0];
    return els;
  }

  function getContainer() {
    return container;
  }

  function getTextContent(el) {
    return el.textContent
      .replace(/[^\w\ åäö]/g, '')
      .trim();
  }

  before(() => {
    container = document.createElement('div');
    container.className = selector.slice(1);
    document.body.appendChild(container);
  });

  beforeEach(() => {
    cal = eventCalendar({
      selector: selector,
      state: {
        currentTime: datestring
      }
    });
  });

  afterEach((done) => {
    cal.destroy(done);
  });

  describe('#ctor', () => {
    it('should print out current month', () => {
      expect(getEls('caption').first.textContent).to.match(/april/i);
    });

    it('should print out current previous month', () => {
      expect(getEls('.evt-calendar__prev-btn').first.textContent).to.match(/march/i);
    });

    it('should print out current next month', () => {
      expect(getEls('.evt-calendar__next-btn').first.textContent).to.match(/may/i);
    });

    it('should create a row with all weekdays', () => {
      var head = getEls('thead th');
      expect(head).to.have.length(7);
      expect(head.map(getTextContent)).to.eql(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    });

    it('should create a rows with all dates in the month', () => {
      var rows = getEls('tbody tr');
      var dates = getEls('tbody td');
      var WEEKS = 5;
      expect(rows).to.have.length(WEEKS);
      expect(dates).to.have.length(WEEKS * 7);
    });
  });

  describe('set locale', () => {
    it('should throw if not invoked with string', () => {
      var exception = 'setLocale: Argument must be valid language string, eg en or sv';
      expect(cal.setLocale).to.throw(exception);
      expect(cal.setLocale.bind(null, '')).to.throw(exception);
      expect(cal.setLocale.bind(null, 42)).to.throw(exception);
    });

    it('should re-render the view', () => {
      cal.setLocale('sv');
      const head = getEls('thead th');
      expect(head.map(getTextContent)).to.eql(['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag']);
    });
  });

  describe('change month', () => {
    it('should change to next month', () => {
      const nextBtn = getEls('.evt-calendar__next-btn').first;
      nextBtn.click();

      const rows = getEls('tbody tr');
      const dates = getEls('tbody td');
      const caption = getEls('caption').first.textContent;
      const WEEKS = 6;

      expect(caption).to.match(/may/i);
      expect(rows).to.have.length(WEEKS);
      expect(dates).to.have.length(WEEKS * 7);
    });

    it('should expose month method', () => {
      expect(cal.month).to.be.a('function');
    });

    it('should return current month (no zero index)', () => {
      var spy = sinon.spy();
      cal.on('will-render', spy);
      expect(cal.month()).to.equal(4);
      expect(spy).to.not.have.been.called;
    });

    it('should set month and rerender', () => {
      var spy = sinon.spy();
      cal.on('will-render', spy);
      cal.month(8);

      const caption = getEls('caption').first.textContent;
      expect(caption).to.match(/august/i);
      expect(spy).to.have.been.called;
    });

    it('should handle displaying previous month over year', () => {
      cal.month(1);
      expect(getEls('.evt-calendar__prev-btn').first.textContent).to.match(/december/i);
    });

    it('should handle spanning over new years', () => {
      cal.month(12);

      const rows = getEls('tbody tr');
      const dates = getEls('tbody td');
      const WEEKS = 5;

      expect(rows).to.have.length(WEEKS);
      expect(dates).to.have.length(WEEKS * 7);
      expect(getEls('.evt-calendar__next-btn').first.textContent).to.match(/january/i);
    });
  });

  describe('#destroy', () => {
    it('should be a function', () => {
      expect(cal.destroy).to.be.a('function');
    });

    it('should remove itself from the dom', () => {
      var domNode = getContainer();
      expect(domNode.children).to.have.length.above(0);
      cal.destroy();
      expect(domNode.children).to.have.length(0);
    });

    it('should accept a callback', () => {
      var spy = sinon.spy();
      cal.destroy(spy);
      expect(spy).to.have.been.calledOnce;
    });
  });
});
