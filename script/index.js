angular.module('link', [])
  .controller('linkController', function() {
    var linkList = this;
    linkList.links = [
      {url:'flowCalc', id: 'chuCalc', title:'Parker Flow Rate Calculator', text: 'Parker Flow Calculator'},
	  {url:'video', id: 'videoPage', title:'Parker Long Video', text: 'Parker Long Video'},
      {url:'testApp', id: 'testPage', title:'Testing Locations', text: 'Test Area'}];
  });
  
$(document).ready(function(){
	$('#testPage').popover({
		placement : 'bottom',
		trigger : 'hover',
		html : true,
		content : '<img src="images/testPage.png" class="media-object">'
	});
	$('#videoPage').popover({
		placement : 'bottom',
		trigger : 'hover',
		html : true,
		content : '<img src="images/intro.PNG" class="media-object thumbnail">'
	});
	$('#chuCalc').popover({
		placement : 'bottom',
		trigger : 'hover',
		html : true,
		content : '<img src="images/calcTooltip.png" class="media-object">'
	});
});