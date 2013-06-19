'use strict';

describe('ngTouch (mobile)', function() {
  var element;


  beforeEach(function() {
    module('ngMobile');
  });

  afterEach(function() {
    element.remove();
  });


  it('should trigger a touch if on touchstart', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-touch="touched = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.touched).toBeUndefined();

    browserTrigger(element, 'touchstart');
    browserTrigger($document, 'touchend');
    expect($rootScope.touched).toEqual(true);
  }));

  it('should trigger a release on touchend', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-release="released = true"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.released).toBeUndefined();

    browserTrigger(element, 'touchstart');
    expect($rootScope.released).toBeUndefined();
    browserTrigger($document, 'touchend');

    expect($rootScope.released).toEqual(true);
  }));


  it('should trigger a move event on touchmove', inject(function($rootScope, $compile, $document) {
    element = $compile('<div ng-move="moved = $event.distance"></div>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.moved).toBeUndefined();
    browserTrigger(element, 'touchstart', [], 20, 20);
    expect($rootScope.moved).toBeUndefined();
    browserTrigger($document, 'touchmove', [], 20, 40);
    expect($rootScope.moved).toEqual(20);
    browserTrigger($document, 'touchend');
  }));

});
