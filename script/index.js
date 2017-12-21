/**

index.js - The javascript for the main index page

Dependencies:
angular.js - used to generate the link boxes
bootstrap.css - used for the popovers
jquery.js - used for the selector help methods

Original Author: Allen Wenzl

Originally created: 6/29/17
Last modified: 7/13/17
Last modified by: Allen Wenzl

**/
// Angular.js controller that generates each link box
angular.module('link', [])
  .controller('linkController', function() {
    var linkList = this;
    linkList.links = [
      {url:'flowCalc',  id: 'chuCalc', title:'Parker Flow Rate Calculator', text: 'Parker Flow Calculator'},
	  {url:'video', id: 'videoPage', title:'Parker Long Video', text: 'Parker Long Video'},
	  {url:'email', id: 'emailGen', title:'Email Generator', text: 'Email Generator'},
	  {url:'schedule', id: 'schedule', title:'Fall 2017 Schedule', text: 'Fall 2017 Schedule'},
	  //{url:'email', id: 'cssFormat', title:'CSS Formatter', text: 'CSS Formatter'},
      {url:'test', id: 'testPage', title:'Testing Location', text: 'Test Area'}];
  });
// loads the tooltips on document load
$(document).ready(function(){
	
	$('#testPage').popover({
		// Tooltip always appears on the bottom
		placement : 'bottom',
		// Makes the popover act like a tool tip by activating on hover
		trigger : 'hover',
		// Small delay to make more user friendly
		delay: {show: 200, hide: 200},
		// adds content and a picture to the popover
		html : true,
		content : '<p>Test area to play around with new features.</p><img src="images/testPage.png" class="media-object center-block ">'
	});
	$('#videoPage').popover({
		placement : 'bottom',
		trigger : 'hover',
		delay: {show: 200, hide: 200},
		html : true,
		content : '<p>A simple chapter selector for a video made for Parker.</p><img src="images/Additional Safety Features.PNG" class="center-block media-object thumbnail">'
	});
	$('#chuCalc').popover({
		placement : 'bottom',
		trigger : 'hover',
		delay: {show: 200, hide: 200},
		html : true,
		content : '<p>Flow calculator to determine the flow rate and V/L ratio of Parker FTS series pumps given an environment setup.</p> <img src="images/calcTooltip.png" class="media-object center-block thumbnail">'
	});

	$('#emailGen').popover({
		placement : 'bottom',
		trigger : 'hover',
		delay: {show: 200, hide: 200},
		html : true,
		content : '<p>An email generator to let anyone write HTML emails.</p> <img src="images/email.PNG" class="media-object center-block thumbnail">'
	});
	
	$('#schedule').popover({
		placement : 'bottom',
		trigger : 'hover',
		delay: {show: 200, hide: 200},
		html : true,
		content : '<p>Schedule for my 2017 Fall Semester.</p> <img src="images/schedule.PNG" class="media-object center-block thumbnail">'
	});
	
	/**
	$('#cssFormat').popover({
		placement : 'bottom',
		trigger : 'hover',
		delay: {show: 200, hide: 200},
		html : true,
		content : '<p>A web app to help you make your CSS more readable.</p> <img src="images/cssFormat.png" class="media-object center-block thumbnail">'
	});
	**/
});