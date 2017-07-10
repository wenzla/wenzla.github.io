var headingCounter = 0;
var sectionCounter = 0;
var SsectionCounter = 0;
var latest = [false, false, false];
var last = new Array();
var lastIndex = 0;
var outputString = new Array();
outputString.push("\n");
outputString.push("<!DOCTYPE html><html><body style=\"color: black; background-color: white\">");
function makeHeading(){
	var title = $("#titleGen").val();
	var date = $("#dateGen").val();
	var isChecked = $('input').is(':checked');
	if (isChecked){
		var today = new Date();
		date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
	}
	var stringGen = "<div id=\"heading" + headingCounter + "\" style=\"background-color: #ddd\"><div style=\"text-align: center; font-weight: bold; font-size: 3ex; padding-top: 1.5ex; color: rgb(78,216,255)\">" + title + "</div><div style=\"text-align: center; padding-top: 1.5ex; padding-bottom: 1.5ex; color: black; \"> Announcements for " + date + "</div></div>";
	$("#buildArea").append(stringGen);
	outputString.push(stringGen);
	headingCounter += 1;
	latest = [true, false, false];
	last[lastIndex] = 0;
	lastIndex += 1;
	
}
//$("#buildArea").append("<div class=\"col-sm-1\"> <p>&nbsp;</p> <button type=\"button\" class=\"btn btn-xs btn-default customBtn\"> <span class=\"glyphicon glyphicon-remove\"></span></button> </div>");	

function makeSection(){
	var title = $("#StitleGen").val();
	var stringGen = "<div id=\"section" + sectionCounter + "\" style=\"font-size: 3.5ex; font-weight: bold; text-align: center; padding-bottom: 1ex; padding-top: 1ex; color: rgb(78,216,255)\">" + title + "<hr></div>";
	$("#buildArea").append(stringGen);
	outputString.push(stringGen);
	sectionCounter += 1;
	latest = [false, true, false];
	last[lastIndex] = 1;
	lastIndex += 1;
	
}
//color:rgb(78,216,255)
function makeSSection(){
	var SSname = $("#SSnameGen").val();
	var SStext = $("#SStextGen").val();
	var stringGen = "<div id=\"Ssection" + SsectionCounter + "\"><div style=\"padding-left: 5%; padding-right: 5%; font-size: 2ex; font-weight: bold; padding-bottom: 0.5ex;\">" + SSname + "</div><p style=\"padding-left: 5%; padding-right: 5%\">" + SStext + "</p></div>";
	$("#buildArea").append(stringGen);
	outputString.push(stringGen);
	SsectionCounter += 1;
	latest = [false, false, true];
	last[lastIndex] = 2;
	lastIndex += 1;
	
}


function undo(){
	var changed = false;
	if(latest[0]){
		$("#heading" + (headingCounter - 1)).remove();
		headingCounter -= 1;
		latest[0] = false;
		changed = true;
	}
	if(latest[1]){
		$("#section" + (sectionCounter - 1)).remove();
		sectionCounter -= 1;
		latest[1] = false;
		changed = true;
	}
	if(latest[2]){
		$("#Ssection" + (SsectionCounter - 1)).remove();
		SsectionCounter -= 1;
		latest[2] = false;
		changed = true;
	}
	if(changed){
		last.pop();
		lastIndex -= 1;
		latest[last[lastIndex - 1]] = true;
		outputString.pop();
	} else {
		alert("Nothing to remove.")
	}	
	
}

function output(){
	outputString.push("</body></html>")
	for (var i = 0; i < outputString.length; i++){
		$("#popupText").append(outputString[i]);
	}
	outputString.pop();
}

function dismissPopup(){
	$("#popupText").empty();
	$('#copyMessage').removeClass('animate');
	
}

function copy(){
	var clipboard = new Clipboard('.copy-button', {
		target: function() {
			return document.querySelector('#popupText');
		}
	});
	e1 = $('#copyMessage');
	e1.addClass('animate');
	e1.css('visibility', 'visible');
	e1.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
	function (e) {
		e1.removeClass('animate');
		e1.css('visibility', 'hidden');
	});

}





