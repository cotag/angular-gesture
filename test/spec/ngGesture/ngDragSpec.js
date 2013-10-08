'use strict';

// Wrapper to abstract over using touch events or mouse events.
var dragTests = function(description, restrictBrowsers, startEvent, moveEvent, endEvent) {
  describe('ngDrag with ' + description + ' events', function() {
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

    it('should trigger start, move and end events', inject(function($rootScope, $compile, $document) {
      element = $compile('<div drag-begin="started = true" ng-drag="moved = true" drag-stop="ended = true"></div>')($rootScope);
      $rootScope.$digest();

      expect($rootScope.started).toBeUndefined();
      expect($rootScope.moved).toBeUndefined();
      expect($rootScope.ended).toBeUndefined();

      browserTrigger(element, startEvent, [], 100, 20);
      browserTrigger(element, moveEvent, [], 20, 20);
      browserTrigger(element, endEvent, [], 20, 20);

      expect($rootScope.started).toBe(true);
      expect($rootScope.moved).toBe(true);
      expect($rootScope.ended).toBe(true);
    }));
  });
}

dragTests('pointer', true  /* restrictBrowers */, 'pointerdown', 'pointermove', 'pointerup');
//dragTests('mouse', false /* restrictBrowers */, 'mousedown',  'mousemove', 'mouseup');

