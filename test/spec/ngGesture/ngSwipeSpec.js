'use strict';

// Wrapper to abstract over using touch events or mouse events.
var swipeTests = function(description, restrictBrowsers, startEvent, moveEvent, endEvent) {
  describe('ngSwipe with ' + description + ' events', function() {
    var element, time, orig_now,
      mockTime = function() {
        return time;
      };

    // Skip tests on IE < 9. These versions of IE don't support createEvent(), and so
    // we cannot control the (x,y) position of events.
    // It works fine in IE 8 under manual testing.
    var msie = +((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
    if (msie < 9) {
      return;
    }

    beforeEach(function() {
      module('ngGesture');
      orig_now = Date.now;
      time = 10;
      Date.now = mockTime;
    });

    afterEach(function() {
      element.remove();
      Date.now = orig_now;
    });

    it('should swipe to the left', inject(function($rootScope, $compile, $document) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 100, 20);
      browserTrigger(element, endEvent, [], 20, 20);
      expect($rootScope.swiped).toBe(true);
    }));

    it('should swipe to the right', inject(function($rootScope, $compile, $document) {
      element = $compile('<div ng-swipe-right="swiped = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 20, 20);
      browserTrigger(element, endEvent, [], 90, 20);
      expect($rootScope.swiped).toBe(true);
    }));

    it('should swipe up', inject(function($rootScope, $compile, $document) {
      element = $compile('<div ng-swipe-up="swiped = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 20, 90);
      browserTrigger(element, endEvent, [], 20, 20);
      expect($rootScope.swiped).toBe(true);
    }));

    it('should swipe down', inject(function($rootScope, $compile, $document) {
      element = $compile('<div ng-swipe-down="swiped = true"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 20, 20);
      browserTrigger(element, endEvent, [], 20, 90);
      expect($rootScope.swiped).toBe(true);
    }));

    it('should not swipe if you move too far vertically', inject(function($rootScope, $compile, $document, $rootElement) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 90, 20);
      browserTrigger(element, moveEvent, [], 70, 200);
      browserTrigger(element, endEvent, [], 20, 20);

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if you move too far horizontally', inject(function($rootScope, $compile, $document, $rootElement) {
      element = $compile('<div ng-swipe-down="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 20, 20);
      browserTrigger(element, moveEvent, [], 200, 70);
      browserTrigger(element, endEvent, [], 20, 90);

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if you slide only a short distance', inject(function($rootScope, $compile, $document, $rootElement) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 90, 20);
      browserTrigger(element, endEvent, [], 80, 20);

      expect($rootScope.swiped).toBeUndefined();
    }));

    it('should not swipe if your finger moves too slowly', inject(function($rootScope, $compile, $document, $rootElement) {
      element = $compile('<div ng-swipe-left="swiped = true"></div>')($rootScope);
      $rootElement.append(element);
      $rootScope.$digest();

      expect($rootScope.swiped).toBeUndefined();

      browserTrigger(element, startEvent, [], 100, 20);
      time = 1000;
      browserTrigger(element, endEvent, [], 20, 20);

      expect($rootScope.swiped).toBeUndefined();
    }));
  });
}

swipeTests('pointer', false  /* restrictBrowers */, 'pointerdown', 'pointermove', 'pointerup');
//swipeTests('mouse', false /* restrictBrowers */, 'mousedown',  'mousemove', 'mouseup');

