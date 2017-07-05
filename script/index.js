angular.module('link', [])
  .controller('linkController', function() {
    var linkList = this;
    linkList.links = [
      {url:'flowCalc',  id: 'chuCalc', title:'Parker Flow Rate Calculator', text: 'Parker Flow Calculator'},
	  {url:'video', id: 'videoPage', title:'Parker Long Video', text: 'Parker Long Video'},
      {url:'testApp', id: 'testPage', title:'Testing Locations', text: 'Test Area'}];
  });
  
$(document).ready(function(){
	$('#testPage').popover({
		placement : 'bottom',
		trigger : 'hover',
		delay: {show: 200, hide: 200},
		html : true,
		content : '<p>Test Area to play around with new features.</p><img src="images/testPage.png" class="media-object center-block">'
	});
	$('#videoPage').popover({
		placement : 'bottom',
		trigger : 'hover',
		delay: {show: 200, hide: 200},
		html : true,
		content : '<p>A simple chapter selector for a video made for Parker.</p><img src="images/intro.PNG" class="center-block media-object thumbnail">'
	});
	$('#chuCalc').popover({
		placement : 'bottom',
		trigger : 'hover',
		delay: {show: 200, hide: 200},
		html : true,
		content : '<p>Flow calculator to determine the flow rate and V/L ratio of Parker FTS series pumps given an environment setup.</p> <img src="images/calcTooltip.png" class="media-object center-block">'
	});
});