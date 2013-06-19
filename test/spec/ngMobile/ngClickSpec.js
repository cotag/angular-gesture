'use strict';

describe('ngClick (mobile)', function() {
  var element, time, orig_now;

  function mockTime() {
    return time;
  }


  beforeEach(function() {
    module('ngMobile');
    orig_now = Date.now;
    time = 1000;
    Date.now = mockTime;
  });

  afterEach(function() {
    element.remove();
    Date.now = orig_now;
  });


  it('should get called on a tap', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.tapped).toBeUndefined();

    browserTrigger(element, 'touchstart');
    browserTrigger($document, 'touchend');
    expect($rootScope.tapped).toEqual(true);
  }));


  it('should pass event object', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-click="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'touchstart');
    browserTrigger($document, 'touchend');
    expect($rootScope.event).toBeDefined();
  }));


  it('should not click if the touch is held too long', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="count = count + 1"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.count = 0;
    $rootScope.$digest();

    expect($rootScope.count).toBe(0);

    time = 10;
    browserTrigger(element, 'touchstart', [], 10, 10);

    time = 900;
    browserTrigger($document, 'touchend', [], 10, 10);

    expect($rootScope.count).toBe(0);
  }));


  it('should not click if the touchend is too far away', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger($document, 'touchend', [], 400, 400);

    expect($rootScope.tapped).toBeUndefined();
  }));


  it('should not click if move tolerance is exceeded', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger($document, 'touchmove', [], 21, 21);
    browserTrigger($document, 'touchend', [], 10, 10);

    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger($document, 'touchend', [], 21, 21);

    expect($rootScope.tapped).toBeUndefined();
  }));


  it('should not click if move tolerance is exceeded', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger($document, 'touchmove', [], 21, 21);
    browserTrigger($document, 'touchend', [], 10, 10);

    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger($document, 'touchend', [], 21, 21);

    expect($rootScope.tapped).toBeUndefined();
  }));


  it('should double click', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-dbl-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    time = 0
    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger($document, 'touchend', [], 10, 10);

    time = 200
    browserTrigger(element, 'touchstart', [], 15, 15);
    browserTrigger($document, 'touchend', [], 17, 17);

    expect($rootScope.tapped).toEqual(true);
  }));


  it('should not double tap if tap interval exceeded', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-dbl-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    time = 0
    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger($document, 'touchend', [], 10, 10);
    time = 500
    browserTrigger(element, 'touchstart', [], 10, 10);
    browserTrigger($document, 'touchend', [], 10, 10);

    expect($rootScope.tapped).toBeUndefined();
  }));


  it('should add the CSS class while the element is held down, and then remove it', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();
    expect($rootScope.tapped).toBeUndefined();

    var CSS_CLASS = 'ng-click-active';

    expect(element.hasClass(CSS_CLASS)).toBe(false);
    browserTrigger(element, 'touchstart', 10, 10);
    expect(element.hasClass(CSS_CLASS)).toBe(true);
    browserTrigger($document, 'touchend', 10, 10);
    expect(element.hasClass(CSS_CLASS)).toBe(false);
    expect($rootScope.tapped).toBe(true);
  }));


  describe('the clickbuster', function() {
    var element1, element2;

    beforeEach(inject(function($rootElement, $document) {
      $document.find('body').append($rootElement);
    }));

    afterEach(inject(function($document) {
      $document.find('body').html('');
    }));


    it('should cancel the following click event', inject(function($rootScope, $compile, $rootElement, $document, $timeout) {
      element = $compile('<div ng-click="count = count + 1"></div>')($rootScope);
      $rootElement.append(element);

      $rootScope.count = 0;
      $rootScope.$digest();

      expect($rootScope.count).toBe(0);

      // Fire touchstart at 10ms, touchend at 50ms, the click at 100ms.
      time = 10;
      browserTrigger(element, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger($document, 'touchend', [], 10, 10);
      $timeout.flush(); // Desktop fall-back clicks are prevented after if click has already fired
      expect($rootScope.count).toBe(1);

      time = 100;
      browserTrigger(element, 'click', [], 10, 10);

      expect($rootScope.count).toBe(1);
    }));


    it('should cancel the following click event even when the element has changed', inject(
        function($rootScope, $compile, $document, $rootElement, $timeout) {
      $rootElement.append(
          '<div ng-show="!tapped" ng-click="count1 = count1 + 1; tapped = true">x</div>' +
          '<div ng-show="tapped" ng-click="count2 = count2 + 1">y</div>'
      );
      $compile($rootElement)($rootScope);

      element1 = $rootElement.find('div').eq(0);
      element2 = $rootElement.find('div').eq(1);

      $rootScope.count1 = 0;
      $rootScope.count2 = 0;

      $rootScope.$digest();

      expect($rootScope.count1).toBe(0);
      expect($rootScope.count2).toBe(0);

      time = 10;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger($document, 'touchend', [], 10, 10);
      $timeout.flush(); // Desktop fall-back clicks are prevented after if click has already fired
      expect($rootScope.count1).toBe(1);

      time = 100;
      browserTrigger(element2, 'click', [], 10, 10);

      expect($rootScope.count1).toBe(1);
      expect($rootScope.count2).toBe(0);
    }));


    it('should not cancel clicks on distant elements', inject(function($rootScope, $compile, $document, $rootElement, $timeout) {
      $rootElement.append(
          '<div ng-click="count1 = count1 + 1">x</div>' +
          '<div ng-click="count2 = count2 + 1">y</div>'
      );
      $compile($rootElement)($rootScope);

      element1 = $rootElement.find('div').eq(0);
      element2 = $rootElement.find('div').eq(1);

      $rootScope.count1 = 0;
      $rootScope.count2 = 0;

      $rootScope.$digest();

      expect($rootScope.count1).toBe(0);
      expect($rootScope.count2).toBe(0);

      time = 10;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger($document, 'touchend', [], 10, 10);
      $timeout.flush(); // Desktop fall-back clicks are prevented after if click has already fired
      expect($rootScope.count1).toBe(1);

      time = 90;
      browserTrigger(element1, 'click', [], 10, 10);

      expect($rootScope.count1).toBe(1);

      time = 100;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 130;
      browserTrigger($document, 'touchend', [], 10, 10);
      $timeout.flush(); // Desktop fall-back clicks are prevented after if click has already fired
      expect($rootScope.count1).toBe(2);

      // Click on other element that should go through.
      time = 150;
      browserTrigger(element2, 'touchstart', [], 100, 120);
      browserTrigger(element2, 'touchend', [], 100, 120);
      $timeout.flush(); // Desktop fall-back clicks are prevented after if click has already fired
      browserTrigger(element2, 'click', [], 100, 120);

      expect($rootScope.count2).toBe(1);

      // Click event for the element that should be busted.
      time = 200;
      browserTrigger(element1, 'click', [], 10, 10);

      expect($rootScope.count1).toBe(2);
      expect($rootScope.count2).toBe(1);
    }));


    it('should not cancel clicks that come long after', inject(function($rootScope, $compile, $document, $timeout) {
      element1 = $compile('<div ng-click="count = count + 1"></div>')($rootScope);

      $rootScope.count = 0;

      $rootScope.$digest();

      expect($rootScope.count).toBe(0);

      time = 10;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger($document, 'touchend', [], 10, 10);
      expect($rootScope.count).toBe(1);


      time = 2700;
      $timeout.flush(); // Desktop fall-back clicks are prevented after if click has already fired
      browserTrigger(element1, 'click', [], 10, 10);

      expect($rootScope.count).toBe(2);
    }));


    it('should not cancel clicks that come long after', inject(function($rootScope, $compile, $document, $timeout) {
      element1 = $compile('<div ng-click="count = count + 1"></div>')($rootScope);

      $rootScope.count = 0;

      $rootScope.$digest();

      expect($rootScope.count).toBe(0);

      time = 10;
      browserTrigger(element1, 'touchstart', [], 10, 10);

      time = 50;
      browserTrigger($document, 'touchend', [], 10, 10);

      expect($rootScope.count).toBe(1);

      time = 2700;
      $timeout.flush(); // Desktop fall-back clicks are prevented if click has already fired
      browserTrigger(element1, 'click', [], 10, 10);

      expect($rootScope.count).toBe(2);
    }));
  });


  describe('click fallback', function() {

    it('should treat a click as a tap on desktop', inject(function($rootScope, $compile, $document) {
      element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.tapped).toBeFalsy();

      browserTrigger(element, 'click');
      expect($rootScope.tapped).toEqual(true);
    }));


    it('should pass event object', inject(function($rootScope, $compile, $document) {
      element = $compile('<div ng-click="event = $event"></div>')($rootScope);
      $rootScope.$digest();

      browserTrigger(element, 'click');
      expect($rootScope.event).toBeDefined();
    }));
  });
});
