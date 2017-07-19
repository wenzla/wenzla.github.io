var placedLine = true;

function canMakeNewLine(){
	placedLine = false;
	var message = $(".newLineMessage");
	message.text("Draw a line in the space below.");
	message.addClass('animate');
	message.css('visibility', 'visible');
	message.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
	function (e) {
		message.removeClass('animate');
		message.css('visibility', 'hidden');
	});
}

$('.origin-point').click(function(event) {
	if (placedLine){
		return;
	}	
	placedLine = true;
    var linkLine = $('<div id="new-link-line"></div>').appendTo('body');
    var origin = $(this);
	var clickX = event.pageX;
	var clickY = event.pageY;
    linkLine
        .css('top', clickY)
        .css('left', clickX);
    
    $(document).mousemove(function linkMouseMoveEvent(event) {
        if($('#new-link-line').length > 0) {
            var originX = clickX;
            var originY = clickY;
            
            var length = Math.sqrt((event.pageX - originX) * (event.pageX - originX) 
                + (event.pageY - originY) * (event.pageY - originY));
        
            var angle = 180 / 3.1415 * Math.acos((event.pageY - originY) / length);
            if(event.pageX > originX)
                angle *= -1;
        
            $('#new-link-line')
                .css('height', length)
                .css('-webkit-transform', 'rotate(' + angle + 'deg)')
                .css('-moz-transform', 'rotate(' + angle + 'deg)')
                .css('-o-transform', 'rotate(' + angle + 'deg)')
                .css('-ms-transform', 'rotate(' + angle + 'deg)')
                .css('transform', 'rotate(' + angle + 'deg)');
        }
    });

    $(document).bind('mousedown.link', function(event) {
        switch(event.which){
            case 1:
                if($(event.target).hasClass("drop-point")){
					$(document).unbind('mousemove.link').unbind('click.link').unbind('keydown.link');             
                    $('#new-link-line').addClass("connected-link-line");
                    $('#new-link-line').attr("id","#connected-link-line");
					$(".connected-link-line").draggable({ opacity: 0.6, containment: "#dropArea", scroll: false })
                }
                break;
            default:
                // Cancel on right click
                endLinkMode();
                removeLine();
        }
    });

    $(document).bind('keydown.link', function(event) {
        // ESCAPE key pressed
        if(event.keyCode == 27) {
            endLinkMode();
            removeLine();
        }
    });
});

function removeLine(){
    $('#new-link-line').remove();
}

function endLinkMode() {
    $(document).unbind('mousemove.link').unbind('click.link').unbind('keydown.link');
}