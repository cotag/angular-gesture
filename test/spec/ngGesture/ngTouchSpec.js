'use strict';

describe('ngTouch (gesture)', function() {
  var element;


  beforeEach(function() {
    module('ngGesture');
  });

  afterEach(function() {
    element.remove();
  });


  it('should trigger a touch if on pointerdown', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-touch="touched = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.touched).toBeUndefined();

    browserTrigger(element, 'pointerdown');
    browserTrigger(element, 'pointerup');
    expect($rootScope.touched).toEqual(true);
  }));

  it('should trigger a release on pointerup', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-release="released = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.released).toBeUndefined();

    browserTrigger(element, 'pointerdown');
    expect($rootScope.released).toBeUndefined();
    browserTrigger(element, 'pointerup');

    expect($rootScope.released).toEqual(true);
  }));


  it('should trigger a move event on pointermove', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-move="moved = $event.distance"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.moved).toBeUndefined();
    browserTrigger(element, 'pointerdown', [], 20, 20);
    expect($rootScope.moved).toBeUndefined();
    browserTrigger(element, 'pointermove', [], 20, 40);
    expect($rootScope.moved).toEqual(20);
    browserTrigger(element, 'pointerup');
  }));

});
