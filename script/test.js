var categoryCount = 6;
var fileIn;

window.onload = function() {
	var fileInput = document.getElementById('fileInput');

	fileInput.addEventListener('change', function(e) {
		var fileIn = fileInput.files[0];
		var textType = /text.*/;

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
	file += '\n';
	var beginBracket = /.*[\w]+ ?\n?{ *\n/mg;
	var cssAttributes = /{\n?(.*{?\:\s?\w*.*;?}?[\n])+}?/mg;
	// {\n(.*\:\s?\w*.*;?[\n])+}? <- def right (not on animation css tho)
	
	var cssGroupNum = file.match(beginBracket).length;
	var grouped = createMatrix(cssGroupNum, 2);
	for (var i = 0; i < cssGroupNum; i++) {
		grouped[i][0] = (file.match(beginBracket)[i]).slice(0,-1).slice(0,-1);
		grouped[i][1] = (file.match(cssAttributes)[i]);
	}
	
	var needFormat = segragate(grouped);
	formatMatrix(needFormat);

}

function formatMatrix(matrix){
	for(var i = 1; i < categoryCount; i++){
		
		if (matrix[i].length > 1) {		
			switch (i) {
				case 1:
					$("#cssResult").append("<br>/* Border Styles */" + "<br><br>");
					break;
				case 2:
					$("#cssResult").append("<br>/* Padding Styles */" + "<br><br>");
					break;
				case 3:
					$("#cssResult").append("<br>/* Background Styles */" + "<br><br>");
					break;
				case 4:
					$("#cssResult").append("<br>/* Font Styles */" + "<br><br>");
					break;
				case 5:
					$("#cssResult").append("<br>/* Animations */" + "<br><br>");
					break;
				default:
					$("#cssResult").append("<br>/* ERROR */" + "<br><br>");
					break;
			}	
		}
		
		$.each(matrix[i], function() {
			var separated = this.split("{");
			var line = separated[0]
			for(var j = 0; j < 61; j++){
				if (j > separated[0].length){
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
	
	$("#cssResult").append("<br>/* Other Styles */" + "<br><br>");
	$.each(matrix[0], function() {
		var separated = this.split("{");
		var line = separated[0]
		for(var j = 0; j < 61; j++){
			if (j > separated[0].length){
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
	
	$("#cssResult").append("<br>");
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
	var borderProps = /border\s*(:|-)/mg; //index 1
	var paddingProps = /padding\s*(:|-)|margin\s*(:|-)|float\s*:/g; //index 2
	var backgroundProps = /background\s*(:|-)/mg; //index 3
	var fontProps = /font\s*(:|-)/mg; //index 4
	var animationProps = /((@|-)keyframes)|(-?animation ?:)/mg; // index 5
	
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


// function to help declare a matrix of arbitrary size for calculations above
function createMatrix(length) {
    var arr = new Array(length || 0),
        i = length;
	// recursively creates an array at each index of the originally produced array 
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createMatrix.apply(this, args);
    }
    return arr;
}