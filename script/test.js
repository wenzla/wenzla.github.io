
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
				$('#cssText').val(fileText);
			}
			reader.readAsText(fileIn);	
		} else {
			$('#cssText').val("File not supported!");
		}
	});
}

function parseText(file) {
	
	var beginBracket = /.*[\w]+\n?{/mg;
	var cssAttributes = /{\n(.*\:\s?\w*.*;?[\n])+}?/mg;
	// {\n(.*\:\s?\w*.*;?[\n])+}? <- def right tho
	var cssGroupNum = file.match(beginBracket).length;
	var grouped = createMatrix(cssGroupNum, 2);
	for (var i = 0; i < cssGroupNum; i++) {
		grouped[i][0] = (file.match(beginBracket)[i]).slice(0,-1);
		grouped[i][1] = (file.match(cssAttributes)[i]);
	}
	
	var needFormat = segragate(grouped);
	
	formatMatrix(needFormat, grouped);
	
	
	//fileArray = file.split('\n');
	
	// removes blank lines
	/**
	for(var i = 0; i < fileArray.length; i++){
		if (fileArray[i].length < 2){
			fileArray.splice(i, 1);
		}
	}
	
	$.each(needFormat, function() {
		$("#cssResult").append(this);
	})**/
	//alert(grouped);
}

function formatMatrix(matrix, attr){
	for(var i = 0; i < 5; i++){
		
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
				default:
					break;
			}	
		}
		
		if (i != 0) {
			$.each(matrix[i], function() {
				$("#cssResult").append(this);
				$("#cssResult").append("<br>");
			})
		}
	}
	
	$("#cssResult").append("<br>/* Other Styles */" + "<br><br>");
	$.each(matrix[0], function() {
		$("#cssResult").append(this);
		$("#cssResult").append("<br>");
	})
	
}


function segragate(array) {
	var segArray = new Array();
	var changeIndex;
	// index 0 means other
	var borderProps = /border\s*(:|-)/mg; //index 1
	var paddingProps = /padding\s*(:|-)|margin\s*(:|-)|float\s*:/g; //index 2
	var backgroundProps = /background\s*(:|-)/mg; //index 3
	var fontProps = /font\s*(:|-):/mg; //index 4
	for(var i = 0; i < 5; i++){
		segArray[i] = new Array();
	}
	for (var i = 0; i < array.length; i++){
		var change = false;
		
		switch (borderProps.test(array[i][1])) {
			case true:
				changeIndex = 1;
				change = true;
				break;
			case false:
				break;
			default:
				break;
		}
		alert(array[i][1] + " : " + paddingProps.test(array[i][1]) + " : " + paddingProps);
		switch (paddingProps.test(array[i][1])) {
			case true:
				changeIndex = 2;
				change = true;
				alert("good");
				break;
			case false:
				break;
			default:
				alert("should legit NEVER fucking happen but does for some reason");
				break;
				
		}
		
		switch (backgroundProps.test(array[i][1])) {
			case true:
				changeIndex = 3;
				change = true;
				break;
			case false:
				break;
			default:
				break;
		}
		
		switch (fontProps.test(array[i][1])) {
			case true:
				changeIndex = 4;
				change = true;
				break;
			case false:
				break;
			default:
				break;
		}
		/**
		if (borderProps.test(array[i][1])) {
			changeIndex = 1;
		} else if (paddingProps.test(array[i][1])) {
			changeIndex = 2;
		} else if (backgroundProps.test(array[i][1])) {
			changeIndex = 3;
		} else if (fontProps.test(array[i][1])) {
			changeIndex = 4;
		} else {
			changeIndex = 0;
		}
		**/
		if (!change){
			changeIndex = 0;
		}
		
		segArray[changeIndex].push(array[i][0]);
	
	}
	
	return segArray;
	
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