/**

video.js - The javascript for the chapter select page

Dependencies:
bootstrap.css - used for the popovers
jquery.js - used for the selector help methods

Original Author: Allen Wenzl

Originally created: 6/29/17
Last modified: 7/13/17
Last modified by: Allen Wenzl

**/

// Youtube URL used to select time start
var youTubeString = "https://www.youtube.com/embed/Z1wAEf_-IGk?autoplay=1&start="
function setTime(time){
	document.getElementById('vid').src = youTubeString + time;
	// autoscrolls to the top of the page
	$('html, body').animate({scrollTop:$(document)}, 500);
}
// On document load, loads the tooltips in on the chapter select buttons
$(document).ready(function(){
	$('#Chap1').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/Introduction.PNG" class="center-block media-object thumbnail">'
	});
	$('#Chap2').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/FTS-300.PNG" class="center-block media-object thumbnail">'
	});
	$('#Chap3').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/AC Motor.PNG" class="center-block media-object thumbnail">'
	});
	$('#Chap4').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/Additional Safety Features.PNG" class="center-block media-object thumbnail">'
	});
	$('#Chap5').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/Reverse and Dry Run.PNG" class="center-block media-object thumbnail">'
	});
	$('#Chap6').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/FTS-350.PNG" class="center-block media-object thumbnail">'
	});
	$('#Chap7').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/FTS-300 EX SS.PNG" class="center-block media-object thumbnail">'
	});
	$('#Chap8').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/FTS-400.PNG" class="center-block media-object thumbnail">'
	});
	$('#Chap9').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/Internet of Things.PNG" class="center-block media-object thumbnail">'
	});
});