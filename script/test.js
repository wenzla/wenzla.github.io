// test js
var headingCounter = 0;
var sectionCounter = 0;
var SsectionCounter = 0;
var latest = [false, false, false];
var last = new Array();
var lastIndex = 0;
function makeHeading(){
	var title = $("#titleGen").val();
	var date = $("#dateGen").val();
	var isChecked = $('input').is(':checked');
	if (isChecked){
		var today = new Date();
		date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
	}
	$("#buildArea").append("<div id=\"heading" + headingCounter + "\" style=\"background-color: #ddd\"><div style=\"text-align: center; font-weight: bold; font-size: 3ex; padding-top: 1.5ex;\">" + title + "</div><div style=\"text-align: center; padding-top: 1.5ex; padding-bottom: 1.5ex; color: #aaa; \">" + date + "</div></div>");
	headingCounter += 1;
	latest = [true, false, false];
	last[lastIndex] = 0;
	lastIndex += 1;
	
}
//$("#buildArea").append("<div class=\"col-sm-1\"> <p>&nbsp;</p> <button type=\"button\" class=\"btn btn-xs btn-default customBtn\"> <span class=\"glyphicon glyphicon-remove\"></span></button> </div>");	

function makeSection(){
	var title = $("#StitleGen").val();
	$("#buildArea").append("<div id=\"section" + sectionCounter + "\" style=\"font-size: 3.5ex; font-weight: bold; text-align: center; padding-bottom: 1ex; padding-top: 1ex;\">" + title + "<hr></div>");
	sectionCounter += 1;
	latest = [false, true, false];
	last[lastIndex] = 1;
	lastIndex += 1;
	
}

function makeSSection(){
	var SSname = $("#SSnameGen").val();
	var SStext = $("#SStextGen").val();
	$("#buildArea").append("<div id=\"Ssection" + SsectionCounter + "\" style=\"font-size: 2ex; font-weight: bold; padding-bottom: 0.5ex;\">" + SSname + "</div> <div><p>" + SStext + "</p></div>");
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
	} else {
		alert("Nothing to remove.")
	}	
	
}

