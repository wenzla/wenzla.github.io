var headingCounter = 0;
var sectionCounter = 0;
var SsectionCounter = 0;
var latest = [false, false, false];
var last = new Array();
var lastIndex = 0;
var outputString = new Array();
outputString.push("\n");
outputString.push("<!DOCTYPE html><html><body>");
function makeHeading(){
	var title = $("#titleGen").val();
	var date = $("#dateGen").val();
	var color = $("#TitleColor").val();
	var textColor = $("#TextColor").val();
	var headColor = $("#HeadingColor").val();
	var isDateChecked = $('.dateCheckbox').is(':checked');
	var isLogoChecked = $('.logoCheckbox').is(':checked');
	var isButtonChecked = $('.buttonCheckbox').is(':checked');
	if (isDateChecked){
		var today = new Date();
		date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
	}
	var logoText = " ";
	if (isLogoChecked){
		logoText = "<div> <img title=\"This is our logo; if you can make a better one, do it and sent it to me!\" style=\"display: block;  margin-left: auto;  margin-right: auto; padding-bottom: 1.5ex;\" src=\"testPage.png\"> </div>";
	}
	var buttonText = " ";
	if (isButtonChecked){
		buttonText = "<div style=\"display: block;  margin-left: auto;  margin-right: auto; height: 20%; text-align: center; padding-bottom: 2ex; padding-top: 2ex;\"> <a style=\"display:inline-block; white-space: nowrap; vertical-align:middle; font-weight: bold; text-decoration-line: none; color: white; border: solid " + color +"; padding: 0.8em; border-radius: 2em; font-size: 14px; background-color: " + color + ";\" href=\"http://google.com\">Visit our site!</a> </div>";
	}
	var stringGen = "<div id=\"heading" + headingCounter + "\" style=\"background-color: " + headColor + "\" class=\"HeadingClass faded\"><div class=\"HeadingTitleClass\" style=\"text-align: center; font-weight: bold; font-size: 3.5ex; padding-top: 1.5ex; padding-bottom: 1.5ex; color:" + color + "\">" + title + "</div>" + logoText + "<div class=\"TextClass\" style=\"text-align: center; padding-top: 1.5ex; padding-bottom: 1.5ex; color: " + textColor + "; \"> Announcements for " + date + "</div>" + buttonText + "</div>";
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
	var color = $("#TitleColor").val();
	var backColor = $("#BackGroundColor").val();
	var stringGen = "<div id=\"section" + sectionCounter + "\" style=\"font-size: 3.5ex; font-weight: bold; text-align: center; padding-bottom: 1ex; padding-top: 1ex; background-color: " + backColor + "; color: " + color + "\" class=\"SectionClass faded\">" + title + "<hr></div>";
	$("#buildArea").append(stringGen);
	outputString.push(stringGen);
	sectionCounter += 1;
	latest = [false, true, false];
	last[lastIndex] = 1;
	lastIndex += 1;
	
}
//color:rgb(78,216,255) - Lighthouse blue
function makeSSection(){
	var SSname = $("#SSnameGen").val();
	var SStext = $("#SStextGen").val();
	var backColor = $("#BackGroundColor").val();
	var textColor = $("#TextColor").val();
	var stringGen = "<div id=\"Ssection" + SsectionCounter + "\" style=\"color: " + textColor + ";\" class=\"TextClass faded\"><div class=\"SSectionClass\" style=\"padding-left: 5%; padding-right: 5%; font-size: 2ex; background-color: " + backColor + "; font-weight: bold; padding-bottom: 0.5ex;\">" + SSname + "</div><p class=\"SSectionClass\" style=\"padding-left: 5%; padding-right: 5%; background-color: " + backColor + ";\">" + SStext + "</p></div>";
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
	$('#copyPopup').modal({
		backdrop: 'static'
	});
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

function addAtag(){
	var Htext = $("#Htext").val();
	var Hlink = $("#Hlink").val();
	var correctURLFormat = new RegExp("\b(http)s?(:\/\/).*\..*\b");
	if(!correctURLFormat.test(Hlink)){
		Hlink = "http://" + Hlink;
	}
	$( "#SStextGen" ).append( '&lt;' + "a href=\"" + Hlink + "\">" + Htext + '&lt;' + "/a>");
}
/**
function changeColors(){
	var backColor = $("#BackGroundColor").val();
	var textColor = $("#TextColor").val();
	var titleColor = $("#TitleColor").val();
	var headColor = $("#HeadingColor").val();
	$('.HeadingClass').css('background-color',headColor);
	$('.HeadingTitleClass').css('color',titleColor);
	$('.SectionClass').css('color',titleColor);
	$('.SectionClass').css('background-color',backColor);
	$('.SectionClass').css('backgroundp-color',titleColor);
	$('.SSectionClass').css('background-color',backColor);
	$('.TextClass').css('color',textColor);
		
}
**/
