
var fileArray = new Array();

window.onload = function() {
	var fileInput = document.getElementById('fileInput');
	var fileDisplayArea = document.getElementById('fileDisplayArea');

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var textType = /text.*/;

		if (file.type.match(textType)) {
			var reader = new FileReader();

			reader.onload = function(e) {
				var fileText = reader.result;
				parseFile(fileText)
			}
			reader.readAsText(file);	
		} else {
			fileDisplayArea.innerText = "File not supported!"
		}
	});
}

function parseFile(file){
	var index = 0;
	fileArray = file.split('\n');
	
	// removes blank lines
	for(var i = 0; i < fileArray.length; i++){
		if (fileArray[i].length < 2){
			fileArray.splice(i, 1);
		}
	}
		
	alert(fileArray)
}