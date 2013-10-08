'use strict';

describe('ngGesture (gesture)', function() {
  var element, time, orig_now;

  function mockTime() {
    return time;
  }


  beforeEach(function() {
    module('ngGesture');
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

    browserTrigger(element, 'pointerdown');
    browserTrigger(element, 'pointerup');
    expect($rootScope.tapped).toEqual(true);
  }));


  it('should pass event object', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-click="event = $event"></div>')($rootScope);
    $rootScope.$digest();

    browserTrigger(element, 'pointerdown');
    browserTrigger(element, 'pointerup');
    expect($rootScope.event).toBeDefined();
  }));


  it('should not click if the touch is held too long', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="count = count + 1"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.count = 0;
    $rootScope.$digest();

    expect($rootScope.count).toBe(0);

    time = 10;
    browserTrigger(element, 'pointerdown', [], 10, 10);

    time = 900;
    browserTrigger(element, 'pointerup', [], 10, 10);

    expect($rootScope.count).toBe(0);
  }));


  it('should not click if the pointerup is too far away', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    browserTrigger(element, 'pointerdown', [], 10, 10);
    browserTrigger(element, 'pointerup', [], 400, 400);

    expect($rootScope.tapped).toBeUndefined();
  }));


  it('should not click if move tolerance is exceeded', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    browserTrigger(element, 'pointerdown', [], 10, 10);
    browserTrigger(element, 'pointermove', [], 21, 21);
    browserTrigger(element, 'pointerup', [], 10, 10);

    browserTrigger(element, 'pointerdown', [], 10, 10);
    browserTrigger(element, 'pointerup', [], 21, 21);

    expect($rootScope.tapped).toBeUndefined();
  }));


  it('should not click if move tolerance is exceeded', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    browserTrigger(element, 'pointerdown', [], 10, 10);
    browserTrigger(element, 'pointermove', [], 21, 21);
    browserTrigger(element, 'pointerup', [], 10, 10);

    browserTrigger(element, 'pointerdown', [], 10, 10);
    browserTrigger(element, 'pointerup', [], 21, 21);

    expect($rootScope.tapped).toBeUndefined();
  }));


  it('should double click', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-dbl-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    time = 0
    browserTrigger(element, 'pointerdown', [], 10, 10);
    browserTrigger(element, 'pointerup', [], 10, 10);

    time = 200
    browserTrigger(element, 'pointerdown', [], 15, 15);
    browserTrigger(element, 'pointerup', [], 17, 17);

    expect($rootScope.tapped).toEqual(true);
  }));


  it('should not double tap if tap interval exceeded', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-dbl-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();

    expect($rootScope.tapped).toBeUndefined();

    time = 0
    browserTrigger(element, 'pointerdown', [], 10, 10);
    browserTrigger(element, 'pointerup', [], 10, 10);
    time = 500
    browserTrigger(element, 'pointerdown', [], 10, 10);
    browserTrigger(element, 'pointerup', [], 10, 10);

    expect($rootScope.tapped).toBeUndefined();
  }));


  it('should add the CSS class while the element is held down, and then remove it', inject(function($rootScope, $compile, $document, $rootElement) {
    element = $compile('<div ng-click="tapped = true"></div>')($rootScope);
    $rootElement.append(element);
    $rootScope.$digest();
    expect($rootScope.tapped).toBeUndefined();

    var CSS_CLASS = 'ng-click-active';

    expect(element.hasClass(CSS_CLASS)).toBe(false);
    browserTrigger(element, 'pointerdown', 10, 10);
    expect(element.hasClass(CSS_CLASS)).toBe(true);
    browserTrigger(element, 'pointerup', 10, 10);
    expect(element.hasClass(CSS_CLASS)).toBe(false);
    expect($rootScope.tapped).toBe(true);
  }));
});
