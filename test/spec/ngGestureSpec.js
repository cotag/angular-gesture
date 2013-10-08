'use strict';

describe('ngGesture gesture reactor', function() {
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


  it('should detect the swipe event via bubbling', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-click="parentTapped = true"><div ng-click="tapped = true"></div></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.tapped).toBeUndefined();
    expect($rootScope.parentTapped).toBeUndefined();

    browserTrigger(element.children(), 'pointerdown');
    browserTrigger(element.children(), 'pointerup');
    expect($rootScope.tapped).toEqual(true);
    expect($rootScope.parentTapped).toBe(true);
  }));
});
