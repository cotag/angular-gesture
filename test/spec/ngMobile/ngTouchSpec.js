'use strict';

describe('ngTouch (mobile)', function() {
  var element;

  // TODO(braden): Once we have other touch-friendly browsers on CI, allow them here.
  // Currently Firefox and IE refuse to fire touch events.
  var chrome = /chrome/.test(navigator.userAgent.toLowerCase());
  if (!chrome) {
    return;
  }


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
    expect($rootScope.released).toEqual(undefined);
    browserTrigger($document, 'touchend');

    expect($rootScope.released).toEqual(true);
  }));

});
