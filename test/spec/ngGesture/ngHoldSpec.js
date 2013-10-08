'use strict';

describe('ngHold (gesture)', function() {
  var element;



  beforeEach(function() {
    module('ngGesture');
  });

  afterEach(function() {
    element.remove();
  });


  it('should trigger hold if the timeout occurs and the user does not move', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();

    browserTrigger(element, 'pointerdown');
    $timeout.flush();
    browserTrigger(element, 'pointerup');
    expect($rootScope.held).toEqual(true);
  }));

  it('should not trigger hold if pointerup comes before the timeout', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();

    browserTrigger(element, 'pointerdown');
    browserTrigger(element, 'pointerup');
    expect(function () {
      $timeout.flush();
    }).toThrow(new Error("No deferred tasks to be flushed"));

    expect($rootScope.held).toBeUndefined();
  }));

  it('should not trigger hold if the user breaks the move threshold', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();

    browserTrigger(element, 'pointerdown', [], 10, 10);
    browserTrigger(element, 'pointermove', [], 400, 400);
    expect(function () {
      $timeout.flush();
    }).toThrow(new Error("No deferred tasks to be flushed"));
    browserTrigger(element, 'pointerup', [], 10, 10);

    expect($rootScope.held).toBeUndefined();
  }));

  it('should trigger hold on right click / context menu by default', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();
    browserTrigger(element, 'contextmenu', [], 0, 0, 2);  // Right mouse button selected
    expect($rootScope.held).toEqual(true);
  }));


  it('should not trigger hold on right click / context menu when requested', inject(function($rootScope, $compile, $timeout, $document) {
    element = $compile('<div ng-hold="held = true" hold-accept-right-click="false"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.held).toBeUndefined();
    browserTrigger(element, 'contextmenu', [], 0, 0, 2);  // Right mouse button selected
    expect($rootScope.held).toBeUndefined();
  }));

});
