'use strict';

describe('ngMobile gesture reactor', function() {
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


  it('should detect the swipe event via bubbling', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-swipe-left="swiped = true"><div ng-click="tapped = true"></div></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.tapped).toBeUndefined();
    expect($rootScope.swiped).toBeUndefined();

    browserTrigger(element.children(), 'touchstart');
    browserTrigger($document, 'touchend');
    expect($rootScope.tapped).toEqual(true);

    browserTrigger(element.children(), 'touchstart', [], 100, 20);
    browserTrigger($document, 'touchend', [], 20, 20);
    expect($rootScope.swiped).toBe(true);
  }));


  it('should recover from lost events', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.swiped).toBeUndefined();

    browserTrigger(element, 'touchstart', [], 100, 20);
    browserTrigger(element, 'touchmove', [], 80, 20);

    browserTrigger(element, 'touchstart', [], 100, 20);
    expect($rootScope.swiped).toBeUndefined();
    browserTrigger($document, 'touchend', [], 20, 20);
    expect($rootScope.swiped).toBe(true);
  }));
});
