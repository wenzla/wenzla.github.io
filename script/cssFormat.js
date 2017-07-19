var categoryCount = 6;


window.onload = function() {
	var fileInput = document.getElementById('fileInput');
	
	fileInput.addEventListener('change', function(e) {
		var 	fileIn = fileInput.files[0];
				textType = /text.*/;
				fileName = '';
				
		if(($("#inputText").length != 0)){
			$("#fileName").empty();
		}
		
		if( this.files && this.files.length > 1 )
			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
		else
			fileName = e.target.value.split( '\\' ).pop();

		$("<span id=\"inputText\"></span>").hide().appendTo($("#fileName")).show('normal');
		var label = $("#inputText");
		if( fileName )	
			label.text(fileName + " loaded.");
		else
			label.text("File chosen was not valid.  Please select again");		
	
		if (fileIn.type.match(textType)) {
			var reader = new FileReader();

			reader.onload = function(e) {
				var fileText = reader.result;
				$('#cssText').val('');
				$('#cssText').val(fileText);
			}
			reader.readAsText(fileIn);	
		} else {
			$('#cssText').val("File not supported!");
		}
	});
}

function parseText(file) {
	if(($("#cssResult").length != 0)){
		$("#cssResult").empty();
	}
	file += '\n';
	var 	beginBracket = /.*[\w]+ ?\n?{ *\n/mg;
			cssAttributes = /{\n?(.*{?\:\s?\w*.*;?}?[\n])+}?(\n*\s)*}?/mg;
			cssGroupNum = file.match(beginBracket).length;
			grouped = createMatrix(cssGroupNum, 2);
	// {\n(.*\:\s?\w*.*;?[\n])+}? <- does not work on animation css

	for (var i = 0; i < cssGroupNum; i++) {
		grouped[i][0] = (file.match(beginBracket)[i]).slice(0,-1).slice(0,-1);
		grouped[i][1] = (file.match(cssAttributes)[i]);
	}
	
	var needFormat = segragate(grouped);
	formatMatrix(needFormat);
	addAnimation($('#cssResult'), 'typed')
	addAnimation($('#copyMessage'), 'typed')

}

function addAnimation(id, animation){
	
	id.css("visibility", "visible");
	id.addClass(animation);
	id.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
	function (e) {
		id.removeClass(animation);
	});
}

function formatMatrix(matrix){
	for(var i = 1; i < categoryCount; i++){		
		if (matrix[i].length > 0) {		
			switch (i) {
				case 1:
					$("#cssResult").append("<br><b>/* Border Styles */</b>" + "<br><br>");
					break;
				case 2:
					$("#cssResult").append("<br><b>/* Padding Styles */</b>" + "<br><br>");
					break;
				case 3:
					$("#cssResult").append("<br><b>/* Background Styles */</b>" + "<br><br>");
					break;
				case 4:
					$("#cssResult").append("<br><b>/* Font Styles */</b>" + "<br><br>");
					break;
				case 5:
					$("#cssResult").append("<br><b>/* Animations */</b>" + "<br><br>");
					break;
				default:
					$("#cssResult").append("<br><b>/* ERROR */</b>" + "<br><br>");
					break;
			}	
		}		
		lineFormat(matrix, i);
	}
	
	$("#cssResult").append("<br><b>/* Other Styles */</b>" + "<br><br>");	
	lineFormat(matrix, 0);	
	$("#cssResult").append("<br>");
}


function lineFormat(matrix, i) {
	$.each(matrix[i], function() {
		var 	separated = this.split("{");
				line = separated[0];
				startColumn = separated[0].length;
		
		if (separated[0].length > 60){
			var 	cssElements = line.split(",")
					runningTotal = 0;
					index = 0;
			
			line = cssElements[index] + ", ";
			runningTotal += cssElements[index].length + 2;
			index++;
			while (index < cssElements.length){
				
				if(runningTotal + cssElements[index].length < 60){
					line += cssElements[index] + ",";
					runningTotal += cssElements[index].length + 2;
					index++;
				} else {
					line += '<br>' + '&nbsp;' + '&nbsp;';
					runningTotal = 0;
				}

			}
			line = line.slice(0,-1);
			startColumn = runningTotal - 1;
			
		}
		for(var j = 0; j < 61; j++){
			if (j > startColumn){
				line += '&nbsp;';
			}
		}
		line += "{" + separated[1];
		if (separated.length > 2){
			for (var k = 2; k < separated.length; k++){
				line += "{" + separated[k];
			}
		}
		$("#cssResult").append(line);
		$("#cssResult").append("<br>");
	})
}


function segragate(array) {
	var segArray = new Array();
	var changeIndex;
	for(var i = 0; i < categoryCount; i++){
		segArray[i] = new Array();
	}
	for (var i = 0; i < array.length; i++){
		var change = false;
		
		changeIndex = categorize(array[i]);
	
		segArray[changeIndex].push(array[i][0] + array[i][1]);	
	}	
	return segArray;	
}

function categorize(attr){
	// index 0 means other
	var 	borderProps = /border\s*(:|-)/mg; //index 1
			paddingProps = /padding\s*(:|-)|margin\s*(:|-)|float\s*:/g; //index 2
			backgroundProps = /background\s*(:|-)/mg; //index 3
			fontProps = /font\s*(:|-)/mg; //index 4
			animationProps = /((@|-)keyframes)|(-?animation ?:)/mg; // index 5
	
	if (borderProps.test(attr[1])) {
		return 1;
	}
	if (paddingProps.test(attr[1])) {
		return 2;
	}
	if (backgroundProps.test(attr[1])) {
		return 3;
	}
	if (fontProps.test(attr[1])) {
		return 4;
	}
	if (animationProps.test(attr[1]) || animationProps.test(attr[0])) {
		return 5;
	}
	return 0;
}

function scrollDown(){
	$('html, body').animate({scrollTop:$(document).height()}, 1200);
}

