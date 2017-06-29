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