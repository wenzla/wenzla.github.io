angular.module('lineApp', [])
  .controller('LineListController', function() {
    var lineList = this;
    lineList.lines = [
      {text:'1', show: true},
	  {text:'2', show: false},
      {text:'3', show: false}];
  });