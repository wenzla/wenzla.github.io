var youTubeString = "https://www.youtube.com/embed/Z1wAEf_-IGk?autoplay=1&start="
function setTime(time){
	 document.getElementById('vid').src = youTubeString + time;
}

$(document).ready(function(){
	$('#Chap1').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/intro.PNG" class="media-object thumbnail">'
	});
	$('#Chap2').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/FTS-300.PNG" class="media-object thumbnail">'
	});
	$('#Chap3').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/acMotor.PNG" class="media-object thumbnail">'
	});
	$('#Chap4').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/safety.PNG" class="media-object thumbnail">'
	});
	$('#Chap5').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/revAndDry.PNG" class="media-object thumbnail">'
	});
	$('#Chap6').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/FTS-350.PNG" class="media-object thumbnail">'
	});
	$('#Chap7').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/FTS-300EXSS.PNG" class="media-object thumbnail">'
	});
	$('#Chap8').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/FTS-400.PNG" class="media-object thumbnail">'
	});
	$('#Chap9').popover({
		placement : 'top',
		trigger : 'hover',
		html : true,
		content : '<img src="images/IoT.PNG" class="media-object thumbnail">'
	});
});