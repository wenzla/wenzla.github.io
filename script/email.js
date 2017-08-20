/**

email.js - The javascript for the email generator

Dependencies:
jquery.js - used for the selector help methods and to change css
clipboard.js - allows me to copy html code (the email) to a user's clipboard

Original Author: Allen Wenzl

Originally created: 7/6/17
Last modified: 8/1/17
Last modified by: Allen Wenzl

**/
// variables used to keep track of the undo feature
var 	headingCounter = 0;
		sectionCounter = 0;
		SsectionCounter = 0;
		latest = [false, false, false];
		last = new Array();
		lastIndex = 0;
		logo = "images/calcTooltip.png"
		outputString = new Array(); // stack used to generate the html email
		exportString = new Array();
		isButtonLink = false;
		buttonURL = "http://google.com";
		buttonTitle = "Visit Our Site!";
outputString.push("<!DOCTYPE html><html><body>");
// generate header button
function makeHeading(){
	// get needed variables
	var 	title = $("#titleGen").val();
			date = $("#dateGen").val();
			color = $("#TitleColor").val();
			textColor = $("#TextColor").val();
			headColor = $("#HeadingColor").val();
			isDateChecked = $('.dateCheckbox').is(':checked');
			isLogoChecked = $('.logoCheckbox').is(':checked');
			isButtonChecked = $('.buttonCheckbox').is(':checked');
	if (isDateChecked){
		// Gets todays date
		var today = new Date();
		date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
	}
	var logoText = " ";
	if (isLogoChecked){
		// adds logo string
		logoText = "<div> <img title=\"This is our logo; if you can make a better one, do it and sent it to me!\" style=\"display: block;  max-height: 20ex; margin-left: auto;  margin-right: auto; padding-bottom: 1.5ex;\" src=\"" + logo + "\"> </div>";
	}
	var buttonText = " ";
	if (isButtonChecked){
		// adds button string
		buttonText = "<div style=\"display: block;  margin-left: auto;  margin-right: auto; height: 20%; text-align: center; padding-bottom: 2ex; padding-top: 2ex;\"> <a style=\"display:inline-block; white-space: nowrap; vertical-align:middle; font-weight: bold; text-decoration-line: none; color: white; border: solid " + color +"; padding: 0.8em; border-radius: 2em; font-size: 14px; background-color: " + color + ";\" href=\"" + buttonURL + "\">" + buttonTitle + "</a> </div>";
	}
	// creates html code used for header of email
	var stringGen = "<div id=\"heading" + headingCounter + "\" style=\"background-color: " + headColor + "\" class=\"HeadingClass faded\"><div class=\"HeadingTitleClass\" style=\"text-align: center; font-weight: bold; font-size: 3.5ex; padding-top: 1.5ex; padding-bottom: 1.5ex; color:" + color + "\">" + title + "</div>" + logoText + "<div class=\"TextClass\" style=\"text-align: center; padding-top: 1.5ex; padding-bottom: 1.5ex; color: " + textColor + "; \"> Announcements for " + date + "</div>" + buttonText + "</div>";
	// puts the html in the email preview area
	$("#buildArea").append(stringGen);
	// pushes html onto email generation stack
	outputString.push(stringGen);
	// keeps track of order added
	headingCounter += 1;
	latest = [true, false, false];
	last[lastIndex] = 0;
	lastIndex += 1;
	exportString.push(title);
	$('#buttonGen').addClass("disabled");
	
}
// generate section button
function makeSection(){
	// get needed variables
	var 	title = $("#StitleGen").val();
			color = $("#TitleColor").val();
			backColor = $("#BackGroundColor").val();
	// creates html code used for section header of email
			stringGen = "<div id=\"section" + sectionCounter + "\" style=\"font-size: 3.5ex; font-weight: bold; text-align: center; padding-bottom: 1ex; padding-top: 1ex; background-color: " + backColor + "; color: " + color + "\" class=\"SectionClass faded\">" + title + "<hr></div>";
	// puts the html in the email preview area
	$("#buildArea").append(stringGen);
	// pushes html onto email generation stack
	outputString.push(stringGen);
	// keeps track of order added
	sectionCounter += 1;
	latest = [false, true, false];
	last[lastIndex] = 1;
	lastIndex += 1;
	exportString.push("[" + title + "]");
	
}

// Just for reference:
//color:rgb(78,216,255) - Lighthouse blue
// generate subsection button
function makeSSection(){
	// get needed variables
	var 	SSname = $("#SSnameGen").val();
			SStext = $("#SStextGen").val();
			backColor = $("#BackGroundColor").val();
			textColor = $("#TextColor").val();
	// creates html code used for subsection of email
			stringGen = "<div id=\"Ssection" + SsectionCounter + "\" style=\"color: " + textColor + ";\" class=\"TextClass faded\"><div class=\"SSectionClass\" style=\"padding-left: 5%; padding-right: 5%; font-size: 2ex; background-color: " + backColor + "; font-weight: bold; padding-bottom: 0.5ex;\">" + SSname + "</div><p class=\"SSectionClass\" style=\"padding-left: 5%; padding-right: 5%; background-color: " + backColor + ";\">" + SStext + "</p></div>";
	// puts the html in the email preview area
	$("#buildArea").append(stringGen);
	// pushes html onto email generation stack
	outputString.push(stringGen);
	// keeps track of order added
	SsectionCounter += 1;
	latest = [false, false, true];
	last[lastIndex] = 2;
	lastIndex += 1;
	exportString.push("(" + SSname + ")");
	exportString.push(SStext);
	
}

function clearPage(){
	$("#buildArea").empty();
	exportString = new Array();
}

// undo button function
function undo(){
	// keeps track if something was undone
	var changed = false;
	// if statement checks which type of html was added last
	if(latest[0]){
		// if header, last header is removed
		$("#heading" + (headingCounter - 1)).remove();
		// updates last added
		headingCounter -= 1;
		latest[0] = false;
		changed = true;
		$('#buttonGen').removeClass("disabled");
		exportString.pop();
	}
	if(latest[1]){
		// if section header, last section header is removed
		$("#section" + (sectionCounter - 1)).remove();
		// updates last added
		sectionCounter -= 1;
		latest[1] = false;
		changed = true;
		exportString.pop();
	}
	if(latest[2]){
		// if subsection, last subsection is removed
		$("#Ssection" + (SsectionCounter - 1)).remove();
		// updates last added
		SsectionCounter -= 1;
		latest[2] = false;
		changed = true;
		exportString.pop();
		exportString.pop();
	}
	// if something changed ...
	if(changed){
		// change last added and pop off html stack
		last.pop();
		lastIndex -= 1;
		latest[last[lastIndex - 1]] = true;
		outputString.pop();
	} else {
		// if nothing happened, tell the user
		alert("Nothing to remove.")
	}	
	
}
// Allows user to import an email given a certain text format
function importEmail() {	
	var 	imported = $("#importString").val();
			lines = imported.split('\n');
			heading = lines.shift();
			sectionFormat = /^ *\[.*\] *$/mg;
			subsectionFormat = /^ *\(.*\) *$/mg;
			subsectionDone = false;
	
	$('input[name=dateCheckbox]').attr('checked', true);
	$('input[name=logoCheckbox]').attr('checked', true);
	$('input[name=buttonCheckbox]').attr('checked', true);
	$("#titleGen").val(heading);
	makeHeading();
	// Let loop know to end
	lines.push("EOF");
	for (var i = 1; i < lines.length; i++){
		if (lines[i].match(/\s*\n/mg)){
			lines.splice(i,1);
		} else {
			break;
		}
	}
	var formatedSSTitle;
	var formatedSTitle;
	for(var i = 0; i < lines.length; i++){
		if (lines[i] == "EOF"){
			break;
		}	
		if(lines[i].match(sectionFormat)){
			formatedSTitle = lines[i].replace(/\[|\]/g, '');
			$("#StitleGen").val(formatedSTitle);
			$("#SStextGen").val('');
			makeSection();
			$("#StitleGen").val('');
			$("#SStextGen").val('');
			$("#SSnameGen").val('');
		} else if(lines[i].match(subsectionFormat)){
			formatedSSTitle = lines[i].replace(/\(|\)/g, '');
			$("#SSnameGen").val(formatedSSTitle);
			$("#SStextGen").val('');
		} else {	
			// the "EOF" was mainly for this:  so I can call i+1 on lines and not error out
			if (lines[i + 1] == "EOF" || lines[i + 1].match(subsectionFormat) || lines[i + 1].match(sectionFormat)){
				$('#SStextGen').val(function(x, text) {
					return text + lines[i] + "<br>";
				});
				subsectionDone = true;
			} else {
				$('#SStextGen').val(function(x, text) {
					return text + lines[i] + "<br>";
				});
			}
			
		}		
		if (subsectionDone){
			subsectionDone = false;
			makeSSection();
			$("#StitleGen").val('');
			$("#SStextGen").val('');
			$("#SSnameGen").val('');
		}
	}
	
	$("#StitleGen").val('');
	$("#SStextGen").val('');
	$("#SSnameGen").val('');
	
}

// output HTML button
function output(){
	// finishes html stack
	outputString.push("</body></html>")
	// itterates through the stack (in reverse stack order, so I guess it's technically a queue here)
	for (var i = 0; i < outputString.length; i++){
		$("#popupText").append(outputString[i]);
	}
	// gets rid of closing tags
	outputString.pop();
	// opens popup
	$('#copyPopup').modal({
		backdrop: 'static'
	});
}

// closes out of output html popup
function dismissPopup(){
	$("#popupText").empty();
	$('#copyMessage').removeClass('animate');
	
}

// copy to clipboard button
function copy(){
	// copies html to clipboard
	var clipboard = new Clipboard('.copy-button', {
		target: function() {
			return document.querySelector('#popupText');
		}
	});
	// fires off the copied to clipboard animated message
	e1 = $('#copyMessage');
	e1.addClass('animate');
	e1.css('visibility', 'visible');
	e1.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
	function (e) {
		e1.removeClass('animate');
		e1.css('visibility', 'hidden');
	});

}

function buttonLink(bool){
	isButtonLink = bool;
}

// insert hyperlink button
function addAtag(){
	var Htext = $("#Htext").val();
	var Hlink = $("#Hlink").val();
	var correctURLFormat = /\b(http)s?(:\/\/).*\..*\b/mg
	var message = " Filler ";
	if(!correctURLFormat.test(Hlink)){
		Hlink = "http://" + Hlink;
	}
	// adds hyperlink code to subsection textbox
	if (!isButtonLink) {
		$( "#SStextGen" ).append( '&lt;' + "a href=\"" + Hlink + "\">" + Htext + '&lt;' + "/a>");
		message = "Added Hyperlink!"
	} else {
		buttonURL = Hlink;
		buttonTitle = Htext;
		message = "Changed Button!"
	}
	
	var e1 = $('#hyperLinkMessage');
	e1.text(message);
	e1.addClass('animate');
	e1.css('visibility', 'visible');
	e1.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
	function (e) {
		e1.removeClass('animate');
		e1.css('visibility', 'hidden');
	});
	
}

function importLogo(){
	logo = $("#imgURL").val();
}

function exportEmail(){

	for (var i = 0; i < exportString.length; i++){
		$("#popupText").append(exportString[i] + '<br>');
	}
	// opens popup
	$('#copyPopup').modal({
		backdrop: 'static'
	});
}