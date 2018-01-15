/**
flowCalculations.js - contains all the javascript and calculations for flowCalc.html

Note: this was originally a small calculator but later had to be expanded to include more features.
Because of this, there may be some sections commented out (or not) that MAY be used later or not.  Also, 
this caclulator originally only had bootstrap as a dependency.  So when jquery was added later, not all 
the original javascript was converted. (still works however)

Dependencies:
angular.js - used to generate "pipes" and "fittings" under the line losses info and fittings info sections, respectively
bootstrap.css - used by almost the entire web app to make it look better; also bootstrap classes are used
by some selectors in this file.
jquery.js - used for convinience when writing this file
jqueryui.js (OBSOLETE) - used for the buildable schematic
jqueryui-touch-punch.js (OBSOLETE) - used to make jqueryui elements mobile compatible
chart.js - used to generate the graph when values are calculated

Original Author: Allen Wenzl
Calculations provided by: Heston Smith, Charles El-Helou, and Andy Meyers (slightly modified by Allen Wenzl)

Originally created: 6/26/17
Last modified: 7/21/17
Last modified by: Allen Wenzl

**/
// scroll to top on page load, used for easier testing
//$(window).on('beforeunload', function() {
    //$(window).scrollTop(0);
//});
// used to determine how many lines and fittings were added
var lines = [true, true, true];
var fittings = [true, true, true];
// keeps track of which lines generate images
var imgAdder = new Array();
var imgSource = new Array();
// holds the images used in the website in an array
var imgArray = new Array();
// load default image into array
for (var o = 0; o < 36; o++){
	imgArray[o] = new Image();
	imgArray[o].src = 'images/logo.jpg';
}
// checks if output data button is already there
var toggled = false;
var dataArray = new Array();
for(var i = 0; i < 50; i++){
	dataArray[i] = new Array();
}

var ctx = $("#flowChart");
var myChart = new Chart(ctx, {});
/**
// loads images for the schematic;  MOSTLY OBSOLETE - will probably delete later
imgArray[0].src = 'schem/180.png';
imgArray[1].src = 'schem/180.png';
imgArray[2].src = 'schem/angle valve.PNG';
imgArray[3].src = 'schem/ball valve.PNG';
imgArray[4].src = 'schem/ball valve.PNG';
imgArray[5].src = 'schem/ball valve.PNG';
imgArray[6].src = 'schem/Branch Flow.png';
imgArray[7].src = 'schem/butterfly valve.PNG';
imgArray[8].src = 'schem/180.png';
imgArray[9].src = 'schem/gate valve 2.PNG';
imgArray[10].src = 'schem/gate valve 2.PNG';
imgArray[11].src = 'schem/gate valve 2.PNG';
imgArray[12].src = 'schem/gate valve 2.PNG';
imgArray[13].src = 'schem/globe valve.PNG';
imgArray[14].src = 'schem/45.png';
imgArray[15].src = 'schem/90 bend.PNG';
imgArray[16].src = 'schem/90 bend.PNG';
imgArray[17].src = 'schem/reducer.PNG';
imgArray[18].src = 'schem/reducer.PNG';
imgArray[19].src = 'schem/expander.PNG';
imgArray[20].src = 'schem/plug valve.PNG';
imgArray[21].src = 'schem/plug valve.PNG';
imgArray[22].src = 'schem/plug valve.PNG';
imgArray[23].src = 'schem/45.png';
imgArray[24].src = 'schem/90 bend.PNG';
imgArray[25].src = 'schem/90 bend.PNG';
imgArray[26].src = 'schem/45.png';
imgArray[27].src = 'schem/90 bend.PNG';
imgArray[28].src = 'schem/expander.PNG';
imgArray[29].src = 'schem/reducer.PNG';
imgArray[30].src = 'schem/swing valve.png';
imgArray[31].src = 'schem/tees.PNG';
imgArray[32].src = 'schem/tees.PNG';
imgArray[33].src = 'schem/tees.PNG';
imgArray[34].src = 'schem/threaded union.png';
**/

// doesn't work :/
$("#frequncy").on("change paste keyup", function() {
   //alert($(this).val()); 
});

/** makes the tank and pump picture draggable within the area on page load - OBSOLETE
$( function() {
	$( "#tankPic" ).draggable({  opacity: 0.6, snap: true, containment: "#dropArea", scroll: false });
	$( "#pumpPic" ).draggable({ opacity: 0.6, snap: true, containment: "#dropArea", scroll: false });
} );
// Appends a new div to the lines section.
// Note: This can also be done in angular but the css is a bit different than the other lines so it would 
// be a bit of a pain to do. **/
function addLine(){
	lines.push(true);
	$("#lineLosses").append(" <div class=\"col-sm-4 faded line" + lines.length + "\"><label for=\"pDiam" + lines.length + "\">Diameter of Pipe Section (Inches)</label><br>	<select class=\"selectpicker col-sm-12\" style=\"height: 4.5ex\" id=\"pDiam" + lines.length + "\"> <option>0</option> <option>2</option> <option>3</option> <option>4</option> <option>6</option> </select></div> <div class=\"col-sm-3 faded line" + lines.length + "\"> <label for=\"pLength" + lines.length + "\">Length of Pipe Section</label> <div class=\"input-group\"> <input type=\"text\" class=\"form-control\" id=\"pLength" + lines.length + "\"> <span class=\"input-group-addon\">ft</span> </div> </div>  <div class=\"col-sm-3 faded line" + lines.length + "\"> <label for=\"roughness" + lines.length + "\">Roughness of Pipe</label>  <div class=\"input-group\"> <input type=\"text\" class=\"form-control\" id=\"roughness" + lines.length + "\" placeholder=\"Example value: 0.01 \"> <span class=\"input-group-addon\">in</span> </div> </div> <div class=\"col-sm-1 faded bottomPad line" + lines.length + "\"> <p>&nbsp;</p> <button type=\"button\" class=\"btn btn-xs btn-default customBtn\" onclick=\"deleteLine(" + lines.length + ")\"> <span class=\"glyphicon glyphicon-remove\"></span>	</button> </div>");	
}
// Appends a new div to the fittings section
function addFitting(){
	fittings.push(true);
	$("#fittingsection").append("<div class=\"col-sm-4 faded fitting" + fittings.length + "\"> <label for=\"fType" + fittings.length + "\">Type of Fitting</label><br> <select class=\"selectpicker col-sm-12\" style=\"height: 4.5ex\" id=\"fType" + fittings.length + "\" onchange=\"getImage(this)\" name=" + fittings.length + "> <option>180°  Return Bend, Flanged</option> <option>180°  Return Bend, Threaded</option> <option>Angle Valve Fully Open</option> <option>Ball Valve </option> <option>Ball Valve (1/2 Closed)</option> <option>Ball Valve (2/3 Closed)</option> <option>Branch Flow, Threaded</option> <option>Butterfly Valve</option> <option>Close Return Bend</option> <option>Gate Valve  </option> <option>Gate Valve (1/2 closed)</option> <option>Gate Valve (1/4 closed)</option> <option>Gate Valve (3/4 closed)</option> <option>Globe Valve</option> <option>Long Radius 45° Flanged</option> <option>Long Radius 90° Flanged</option> <option>Long Radius 90° Threaded</option> <option>Pipe Entrance (inward Projecting)</option> <option>Pipe Entrance (Sharp Edged)</option> <option>Pipe Exit</option> <option>Plug Valve 3-Way Thru-Flow</option> <option>Plug Valve Branch Flow</option> <option>Plug Valve Straightaway</option> <option>Regular 45° Threaded</option> <option>Regular 90° Flanged </option> <option>Regular 90° Threaded </option> <option>Standard Elbow 45°</option> <option>Standard Elbow Long Radius 90°</option> <option>Sudden Expander</option> <option>Sudden Reducer</option> <option>Swing Check Valve</option> <option>Tees, Branch Flow, Flanged</option> <option>Tees, Line Flow, Flanged</option> <option>Tees, Line Flow, Threaded</option> <option>Threaded Union</option> </select> </div> <div class=\"col-sm-3 faded fitting" + fittings.length + "\"> <label for=\"fDiam" + fittings.length + "\">Diameter (Inches)</label><br> <select class=\"selectpicker col-sm-12\" style=\"height: 4.5ex\" id=\"fDiam" + fittings.length + "\"> <option>2</option> <option>3</option> <option>4</option> <option>6</option> </select> </div> <div class=\"col-sm-3 faded fitting" + fittings.length + "\"> <div class=\"form-group \"> <label for=\"fNum" + fittings.length + "\">Number of Fittings</label> <input type=\"text\" class=\"form-control \" id=\"fNum" + fittings.length + "\"> </div> </div> </div> <div class=\"col-sm-1 faded fitting" + fittings.length + "\"> <div class=\"col-xs-12\">&nbsp;</div> <div class=\"col-xs-12\"> <label class=\"checkbox-inline PSCheckbox fitting" + fittings.length + "\"> <input type=\"checkbox\" value=\"\"  class=\"fitCheck" + fittings.length + "\" onchange=\"checkboxOne(this)\" id=\"check" + fittings.length + "\">Parallel</label> </div> <div class=\"col-xs-12\"> <label class=\"checkbox-inline PSCheckbox fitting" + fittings.length + "\"> <input type=\"checkbox\" value=\"\"  class=\"fitCheck" + fittings.length + "\" onchange=\"checkboxOne(this)\">Series</label> </div></div> <div class=\"col-sm-1 faded bottomPad fitting" + fittings.length + "\"> <p>&nbsp;</p> <button type=\"button\" class=\"btn btn-xs btn-default customBtn\" onclick=\"deleteFitting(" + fittings.length +")\"> <span class=\"glyphicon glyphicon-remove\"></span>	</button> </div>");
}
// Deletes a div from the lines section
// Note: this can also be done in angular like above.
function deleteLine(line){
	$(".line" + line).fadeOut("slow", function(){
		$(".line" + line).remove();
	});	
	lines[line - 1] = false;
}
// Deletes a div from the fittings section
function deleteFitting(fit){
	$(".fitting" + fit).fadeOut("slow", function(){
		$(".fitting" + fit).remove();
		$("#imgfType" + fit).remove();
	});	
	fittings[fit - 1] = false;
}

function checkboxOne(obj){
	$('input.' + obj.className).not(obj).prop('checked', false);
}

// Validates that the user inputted valid values for certain sections
function checkForm() {
	var returnValue = true;
	// regex for all integers and decimals that are not negative
	var numRegex = /(^-?[0-9]+$|^[0-9]*\.[0-9]+$)/g;
	// checks if user selected a pump
	if($('input[name="pumps"]:checked').val() == null){
		$("#alertMessage").text("Please select a pump under \"Pump Options.\"");
		if(!$("#alert").is(":visible")){
			$("#alert").fadeIn("slow");
		}
		returnValue =  false;
	}
	// checks if user inputted numbers correctly
	// $('.checkVals input[type="text"]').each(function()
	$('.checkVals input[type="text"]').each(function(){
        if (!this.value.match(numRegex)){
			// the box with the wrong number gets a red outline
			this.style = "border-color: red; box-shadow: inset 0 1px 1px rgba(0,0,0,0.075), 0 0 7px rgba(200,15,15,0.6);"
			// A warning message tells the user they messed up entering values
			$("#alertMessage").text("Please change the highlighted values above.");
			if(!$("#alert").is(":visible")){
				$("#alert").fadeIn("slow");
			}
            returnValue =  false;
		} else {
			// removes the red box since the user fixed their mistake
			this.style = "border-color: none; box-shadow: none;"
		}			
	});
	// Makes sure the frequency is between 1 and 90
	var freq = $("#frequency");
	if(freq.val() > 90 || freq.val() < 1){
		$("#alertMessage").text("Please select a frequency in the valid range of 1-90");
		if(!$("#alert").is(":visible")){
			$("#alert").fadeIn("slow");
		}
		returnValue =  false;
	} 	

	// If the user fixed the mistakes, the error message fades away.
	if($("#alert").is(":visible") && returnValue){
		$("#alert").fadeOut("slow");
	}
	return returnValue;
}

// Was originally calculating at one frequency but a graph was later added to the page which means I had
// to calculate an array of values to graph.  The javascript was converted from single value to array, but
// the loops are probably not as effecient as they could be.
function calculate() {
	// Event tracking for clicking this button
	_gaq.push(['_trackEvent', 'Flow Calculator', 'click', 'Calculate', 3, false]);
	// Doesn't even bother with calculations if the user inputted questionable values
	if (!checkForm()){
		return;
	}
	// removes then (later) adds the graph from the DOM for it to work correctly
	$("#flowChart").remove()
	// Gets variables used for calculations
	var height = $("#height").val();
	var atm = $("#atm").val();
	var dPressure = $("#dPressure").val();
	var tPressure = $("#tPressure").val();
	var temperature = $("#temperature").val();
	var RVP = $("#RVP").val();
	var pump = $('input[name="pumps"]:checked').val();
	var freq = $("#frequency").val();
	var density = $("#fluid_density").val();
	
	var freqs = new Array();
	// graphs from frequency 1hz to 40hz above what the user inputed
	var loopIndex = parseInt(freq) + 40;
	for (var i = 0; i < loopIndex; i++){
		freqs[i] = (i+1);
	}
	//loopIndex = 60;
	// npshr in psi
	var npshrpsis = new Array();
	var npshrpsisRVP = new Array(); // 4" RVP Pump
	var npshrpsisPD = new Array(); // PD Pump Only
	for (var i = 0; i < loopIndex; i++){
		npshrpsis[i] = (((pump * Math.pow(((freqs[i] * 30.0)/1800.0), 1.5)) + 0.5).toFixed(4)) / (2.3066587/0.76);
		npshrpsisRVP[i] = (((3.2 * Math.pow(((freqs[i] * 30.0)/1800.0), 1.5))).toFixed(4)) / (2.3066587/0.76);
		npshrpsisPD[i] = (((21 * Math.pow(((freqs[i] * 30.0)/1800.0), 1.5)) + 1).toFixed(4)) / (2.3066587/0.76);
		// npshrpsis[i] = (((pump * Math.pow(((freqs[i] * 30.0)/1800.0), 1.5)) + 0.5) * 32.2 * density) / 144.0;
	}
	loopIndex = parseInt(freq) + 40;
	// convert it to ft^2/s
	var kinematicViscosity = ($("#kViscosity").val())*0.0000108;
	// There can be a variable amount of pipes so we need a dynamically sized array to keep track of them
	var pipesDValue = new Array();
	var roughnesses = new Array();
	var pipeLength = new Array();
	// gets the diameter, roughness and length of each pipe
	for (var i = 0; i < lines.length; i++){
		if(lines[i]){
			pipesDValue.push($("#pDiam" + (i + 1)).find("option:selected").text());
			roughnesses.push($("#roughness" + (i + 1)).val());
			pipeLength.push($("#pLength" + (i + 1)).val());
		}
	}
	var roughRatio = new Array();
	for(var i = 0; i < pipesDValue.length; i++){
		roughRatio.push(roughnesses[i]/pipesDValue[i]);
	}
	
	var qs = new Array();
	// Theoretical flowrates used in this calculation
	for (var i = 0; i < loopIndex; i++){
		// 3" RVP flowrate
		if (pump == 3){
			qs[i] = (3.72 * freqs[i]) - (0.132 * dPressure);
		} else if (pump == 8.5){
			// 4" flowrate
			qs[i] = Math.round((-0.626 * dPressure) + (0.296 * (freqs[i]*30)));
		} else if (pump == 7){
			// 3" flowrate
			qs[i] = (3.853 * freqs[i]) - (0.1585 * dPressure) + 1.0701;
		} else {
			qs[i] = (pump * freqs[i]);
		}
	}
	// flow rate used if setup has parallel elements
	var pqs = new Array();
	for (var i = 0; i < loopIndex; i++){
		pqs[i] = qs[i]/2;
	}
		
	// Area of each pipe
	var pipeAreas = new Array();
	for (var i = 0; i < pipesDValue.length; i++){
		pipeAreas.push(Math.PI * Math.pow((pipesDValue[i])/2.0, 2));
	}
	// k values of each pipe
	var k = createMatrix(loopIndex, pipesDValue.length);
	for(var h = 0; h < loopIndex; h++){
		for(var i = 0; i < pipeAreas.length; i++){
			k[h][i] = (((pipeLength[i] * 12) / pipesDValue[i]) * (1.325/Math.pow(Math.log(roughnesses[i]/(3.7*pipesDValue[i])+(5.74/Math.pow((((qs[h]*0.00223)/(pipeAreas[i]/144))*pipesDValue[i]/12)/kinematicViscosity, 0.9))),2)));
		}	
	}
	
	// There can be a variable amount of fittings so we need a dynamically sized array to keep track of them
	var fittingsD = new Array();
	var fittingsT = new Array();
	var fittingsDValue = new Array();
	var fNums = new Array();
	// gets the diameter, number, type, and if parallel of each pipe
	for (var i = 1; i < (fittings.length + 1); i++){
		if(fittings[i-1]){
			fittingsD.push(document.getElementById("fDiam" + i).selectedIndex);
			fittingsT.push(document.getElementById("fType" + i).selectedIndex);
			fittingsDValue.push($("#fDiam" + i).find("option:selected").text());
			fNums.push($("#fNum" + i).val());
		}
	}
	// matrix of all the different type of fittings' k values
 	var matrix = [[0.2,	0.2,	0.2	,0.2],[1.5,	1.5	,1.5,	1.5],[2	,2	,2	,2],[0.06,	0.05,	0.05	,0.05],	[5.5,	5.5	,5.5,	5.5],[210,	210,	210,	210],[2	,2	,2	,2],[0.86,	0.81	,0.77,	0.68],	[0.95	,0.9	,0.85	,0.75],	[0.15	,0.14,	0.14,	0.12],	[2.1	,2.1,	2.1	,2.1],	[0.26,	0.26	,0.26	,0.26],	[17	,17	,17	,17],	[6.5	,6.1,	5.8,	5.1],	[0.2	,0.2	,0.2,	0.2],	[0.2,	0.2	,0.2,	0.2],	[0.7	,0.7,	0.7,	0.7],	[0.78,	0.78	,0.78,	0.78],	[0.5,	0.5	,0.5,	0.5],	[1	,1	,1	,1],	[0.57	,0.54,	0.51,	0.45],	[1.71,	1.62	,1.53	,1.35],	[0.34	,0.32,	0.31	,0.27],	[0.4,	0.4	,0.4	,0.4],	[0.3	,0.3,	0.3	,0.3],	[1.5	,1.5	,1.5,	1.5],	[0.3	,0.29,	0.27,	0.24],	[0.3	,0.29,	0.27,	0.24],	[0.3	,0.19,	0.3	,0],	[0,	0.275,	0.2	,0.275],	[2,2	,2,	2],	[1,	1,	1,	1],	[0.2,	0.2	,0.2,	0.2],	[0.9	,0.9,	0.9,	0.9],	[0.08,	0.08	,0.08,	0.08]];
	// gets the k values of the fittings actually user-specified
	var kFittings = new Array();
	// loop variable
	var p = 0;
	var couplingK = 0.0000088;
	while (p < fittingsT.length){
		kFittings.push(matrix[fittingsT[p]][fittingsD[p]] * fNums[p]);
		p += 1;
	}
	// holds which fittings are in parallel
	var fitParallel = new Array();
	// keeps track of k and k in parallel values of each fitting
	var kDiams = new Array();
	var pkDiams = new Array();
	var couplingLoss = new Array();
	for (var i = 0; i < loopIndex; i++){
		kDiams[i] = [0,0,0,0];
		pkDiams[i] = [0,0,0,0];
		couplingLoss[i] = couplingK * Math.pow(qs[i],2);
	}
	
	// gets which fittings are in parallel
	for(var i = 0; i < fittingsDValue.length; i++){
		if($("#check" + (i+1)).is(":checked")){
			fitParallel[i] = true;
		} else {
			fitParallel[i] = false;
		}
	}
	// keeps track of the k values for each of the 4 possible diameters
	for(var h = 0; h < loopIndex; h++){
		for(var i = 0; i < pipesDValue.length; i++){
			if(pipesDValue[i] == 2){
				kDiams[h][0] += parseFloat(k[h][i]);			
			} else if (pipesDValue[i] == 3){
				kDiams[h][1] += parseFloat(k[h][i]);
			} else if (pipesDValue[i] == 4){
				kDiams[h][2] += parseFloat(k[h][i]);
			} else if (pipesDValue[i] == 6){
				kDiams[h][3] += parseFloat(k[h][i]);
			}	 
		}	
	}
	// keeps track of the k values for each of the 4 possible diameters (of fittings this time)
	for(var h = 0; h < loopIndex; h++){
		for(var i = 0; i < fittingsDValue.length; i++){
			if(!fitParallel[i]){
				if(fittingsDValue[i] == 2){
					kDiams[h][0] += kFittings[i];			
				} else if (fittingsDValue[i] == 3){
					kDiams[h][1] += kFittings[i];
				} else if (fittingsDValue[i] == 4){
					kDiams[h][2] += kFittings[i];
				} else if (fittingsDValue[i] == 6){
					kDiams[h][3] += kFittings[i];
				}
			} else {
				if(fittingsDValue[i] == 2){
					pkDiams[h][0] += kFittings[i];			
				} else if (fittingsDValue[i] == 3){
					pkDiams[h][1] += kFittings[i];
				} else if (fittingsDValue[i] == 4){
					pkDiams[h][2] += kFittings[i];
				} else if (fittingsDValue[i] == 6){
					pkDiams[h][3] += kFittings[i];
				}
			}
		}
	}
	// get strainer and breakaway valve variables
	// Note: the DValues would not work with jQuery Selectors
	var StrainerDValue = document.getElementById("sDiam").options[document.getElementById("sDiam").selectedIndex].text;
	var BreakawayDValue = document.getElementById("bDiam").options[document.getElementById("bDiam").selectedIndex].text;
	var breakawayNum = $("#bNum").val();
	var StrainerNum = $("#sNum").val();
	var strainerCheck = $("#checkStrainer").is(":checked");
	var breakawaycheck = $("#checkBreak").is(":checked");

	// resistance based on size of the strainer
	var resistances = [0.0005, 0.00006, 0.0000125, 0.000006]; // GRAPHING CURVES FOR JAMES
	var resistance;
	if (StrainerDValue == 2){
		resistance = 0.0005;
	} else if (StrainerDValue == 3){
		resistance = 0.00006;
	} else if (StrainerDValue == 4){
		resistance = 0.0000125;
	} else if (StrainerDValue == 6){
		resistance = 0.000006;
	}

	// gets breakaway valve pressure drop value dependant on diameter and if it is in parallel
	BPressureDrops = new Array();
	BPressureDrops4 = new Array();
	BPressureDrops6 = new Array();
	BPressureDrops4p = new Array();
	BPressureDrops6p = new Array();
	// BVG 1
	var breakawayGraph4 = new Array();
	var breakawayGraph6 = new Array();
	var breakawayGraph4p = new Array();
	var breakawayGraph6p = new Array();
	for (var i = 0; i < loopIndex; i++){
		if(!breakawaycheck){
			if (BreakawayDValue != 4){
				BPressureDrops[i] = (0.0000122 * Math.pow(qs[i], 2));
				// 0.000007q^2 - 0.00001q - 0.0013
				BPressureDrops4[i] = (0.0000122 * Math.pow(qs[i], 2));
			} else {
				BPressureDrops[i] = (0.00001 * Math.pow(qs[i], 2)) + (-0.0005*qs[i]) + 0.0332;
				BPressureDrops6[i] = (0.00001 * Math.pow(qs[i], 2)) + (-0.0005*qs[i]) + 0.0332;
			}
		} else { // in parallel
			if (BreakawayDValue != 4){
				BPressureDrops[i] = (0.0000122 * Math.pow(qs[i], 2));
				BPressureDrops4p[i] = (0.0000122 * Math.pow(qs[i], 2));
			} else {
				BPressureDrops[i] = (0.00001 * Math.pow(pqs[i], 2)) + (-0.0005*pqs[i]) + 0.0332;
				BPressureDrops6p[i] = (0.00001 * Math.pow(pqs[i], 2)) + (-0.0005*pqs[i]) + 0.0332;
			}
		}
		// BVG 2
		BPressureDrops[i] = BPressureDrops[i] * breakawayNum;
		breakawayGraph4[i] = (0.0000122 * Math.pow(qs[i], 2)) * 1;
		// 0.00001q^2
		breakawayGraph6[i] = ((0.000007 * Math.pow(qs[i], 2)) + (-0.00001*qs[i]) + -0.0013) * 1;
		breakawayGraph4p[i] = (0.0000122 * Math.pow(pqs[i], 2)) * (1 + 1);
		breakawayGraph6p[i] = ((0.000007 * Math.pow(pqs[i], 2)) + (-0.00001*pqs[i]) + -0.0013) * (1 + 1);
	}
	//pressure drop of the strainer based on number and if in parallel
	var SPressureDrops = new Array();
	// SG 1
	var strainerGraph2 = new Array();
	var strainerGraph3 = new Array();
	var strainerGraph4 = new Array();
	var strainerGraph6 = new Array();
	var strainerGraph2p = new Array();
	var strainerGraph3p = new Array();
	var strainerGraph4p = new Array();
	var strainerGraph6p = new Array(); // GRAPHING CURVES FOR JAMES
	for (var i = 0; i < loopIndex; i++){
		if(!strainerCheck){
			SPressureDrops[i] = (resistance * Math.pow(qs[i],2)) * StrainerNum;
		} else{
			SPressureDrops[i] = (resistance * Math.pow(pqs[i],2)) * StrainerNum;
			SPressureDrops[i] = SPressureDrops[i]/2.0;
		}
		// SG2
		strainerGraph2[i] = (resistances[0] * Math.pow(qs[i],2)) * 1;
		strainerGraph3[i] = (resistances[1] * Math.pow(qs[i],2)) * 1;
		strainerGraph4[i] = (resistances[2] * Math.pow(qs[i],2)) * 1;
		strainerGraph6[i] = (resistances[3] * Math.pow(qs[i],2)) * 1;
		strainerGraph2p[i] = ((resistances[0] * Math.pow(pqs[i],2)) * (1+1));
		strainerGraph3p[i] = ((resistances[1] * Math.pow(pqs[i],2)) * (1+1));
		strainerGraph4p[i] = ((resistances[2] * Math.pow(pqs[i],2)) * (1+1));
		strainerGraph6p[i] = ((resistances[3] * Math.pow(pqs[i],2)) * (1+1));
	}
	
	// will eventually become velocities later
	var velocityM = new Array();
	for (var i = 0; i < loopIndex; i++){
		velocityM[i] = [2,3,4,6];
	}
	for (var i = 0; i < loopIndex; i++){
		for (var j = 0; j < velocityM[0].length; j++){
			velocityM[i][j] = (qs[i]*0.00223)/(Math.PI * Math.pow(velocityM[i][j]/24,2));
		}
	}
	var headVelocityM = createMatrix(loopIndex, velocityM[0].length);
	for (var i = 0; i < loopIndex; i++){
		for (var j = 0; j < velocityM[0].length; j++){
			headVelocityM[i][j] = (Math.pow(velocityM[i][j], 2))/(2*32.2);
		}
	}
	var headLosses = new Array();
	for (var i = 0; i < loopIndex; i++){
		headLosses[i] = 0;
		for(var j = 0; j < velocityM[0].length; j++){
			headLosses[i] += kDiams[i][j] * headVelocityM[i][j];
		}
	}	
	// just a conversion factor
	var headLossPsis = new Array();
	for (var i = 0; i < loopIndex; i++){
		headLossPsis[i] = (headLosses[i] * density * 32.2) / 144.0;
	}
	// gets velocities of elements if they are in parallel
	var pvelocityM = new Array();
	for (var i = 0; i < loopIndex; i++){
		pvelocityM[i] = [2,3,4,6];
	}
	for (var i = 0; i < loopIndex; i++){
		for (var j = 0; j < pvelocityM[0].length; j++){
			pvelocityM[i][j] = (qs[i]*0.00223)/(Math.PI * Math.pow(pvelocityM[i][j]/24,2));
		}
	}
	var pheadVelocityM = createMatrix(loopIndex, pvelocityM[0].length);
	for (var i = 0; i < loopIndex; i++){
		for (var j = 0; j < pvelocityM[0].length; j++){
			pheadVelocityM[i][j] = (Math.pow(pvelocityM[i][j], 2))/(2*32.2);
		}
	}
	var pheadLosses = new Array();
	for (var i = 0; i < loopIndex; i++){
		pheadLosses[i] = 0;
		for(var j = 0; j < pvelocityM[0].length; j++){
			pheadLosses[i] += pkDiams[i][j] * pheadVelocityM[i][j];
		}
	}	
	
	// gets total headloss of setup
	var pheadLossPsis = new Array();
	var totalHeadLossPsis = new Array();
	var breakawayGraphLoss4 = new Array();
	var breakawayGraphLoss6 = new Array();
	var breakawayGraphLoss4p = new Array();
	var breakawayGraphLoss6p = new Array();
	// SG 3
	var strainerGraphLoss2 = new Array();
	var strainerGraphLoss3 = new Array();
	var strainerGraphLoss4 = new Array();
	var strainerGraphLoss6 = new Array();
	var strainerGraphLoss2p = new Array();
	var strainerGraphLoss3p = new Array();
	var strainerGraphLoss4p = new Array();
	var strainerGraphLoss6p = new Array(); // For JAMES CURVES
	// BVG 3
	for (var i = 0; i < loopIndex; i++){
		pheadLossPsis[i] = (pheadLosses[i] * density * 32.2) / 144.0;
		// NOTE: THIS IS PROBABLY NOT RIGHT BUT BEING IN PARALLEL SHOULD REDUCE THE TOTAL HEAD LOSS AS COMPARED TO IN SERIES
		totalHeadLossPsis[i] = headLossPsis[i] + BPressureDrops[i] + SPressureDrops[i] + (pheadLossPsis[i] / 2.0);
		//SG 4
		strainerGraphLoss2[i] = headLossPsis[i] + BPressureDrops[i] + strainerGraph2[i] + (pheadLossPsis[i] / 2.0);
		strainerGraphLoss3[i] = headLossPsis[i] + BPressureDrops[i] + strainerGraph3[i] + (pheadLossPsis[i] / 2.0);
		strainerGraphLoss4[i] = headLossPsis[i] + BPressureDrops[i] + strainerGraph4[i] + (pheadLossPsis[i] / 2.0);
		strainerGraphLoss6[i] = headLossPsis[i] + BPressureDrops[i] + strainerGraph6[i] + (pheadLossPsis[i] / 2.0);
		strainerGraphLoss2p[i] = headLossPsis[i] + BPressureDrops[i] + strainerGraph2p[i] + (pheadLossPsis[i] / 2.0);
		strainerGraphLoss3p[i] = headLossPsis[i] + BPressureDrops[i] + strainerGraph3p[i] + (pheadLossPsis[i] / 2.0);
		strainerGraphLoss4p[i] = headLossPsis[i] + BPressureDrops[i] + strainerGraph4p[i] + (pheadLossPsis[i] / 2.0);
		strainerGraphLoss6p[i] = headLossPsis[i] + BPressureDrops[i] + strainerGraph6p[i] + (pheadLossPsis[i] / 2.0);
		//BVG 4
		breakawayGraphLoss4[i] = headLossPsis[i] + breakawayGraph4[i] + SPressureDrops[i] + (pheadLossPsis[i] / 2.0);
		breakawayGraphLoss6[i] = headLossPsis[i] + breakawayGraph6[i] + SPressureDrops[i] + (pheadLossPsis[i] / 2.0);
		breakawayGraphLoss4p[i] = headLossPsis[i] + breakawayGraph4p[i] + SPressureDrops[i] + (pheadLossPsis[i] / 2.0);
		breakawayGraphLoss6p[i] = headLossPsis[i] + breakawayGraph6p[i] + SPressureDrops[i] + (pheadLossPsis[i] / 2.0);
	}
	// alert("Phead: " + pheadLossPsis[freq] + '\n' + "head: " + headLossPsis[freq] + '\n' + "total: " + totalHeadLossPsis[freq]);
	var staticHead = ((density * 32.2 * height)/144);
	var staticHeadLow = ((density * 32.2 * 0)/144);
	var staticHeadHigh = ((density * 32.2 * 6)/144);
	// had to use parse statements else it just appended strings to each other then subtracted a number from 
	// a string creating a NaN
	var pfCalcs = new Array();
	var pfCalcsRVP = new Array();
	var pfCalcsPD = new Array();
	var pfCalcsLow = new Array();
	var pfCalcsHigh = new Array();
	// SG 5
	var strainerGraphPf2 = new Array();
	var strainerGraphPf3 = new Array();
	var strainerGraphPf4 = new Array();
	var strainerGraphPf6 = new Array();
	var strainerGraphPf2p = new Array();
	var strainerGraphPf3p = new Array();
	var strainerGraphPf4p = new Array();
	var strainerGraphPf6p = new Array(); // For JAMES CURVES
	// BVG 5
	var breakawayGraphPf4 = new Array();
	var breakawayGraphPf6 = new Array();
	var breakawayGraphPf4p = new Array();
	var breakawayGraphPf6p = new Array();
	for (var i = 0; i < loopIndex; i++){
		pfCalcs[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(totalHeadLossPsis[i]) - parseFloat(npshrpsis[i]) //- couplingLoss[i];
		pfCalcsRVP[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(totalHeadLossPsis[i]) - parseFloat(npshrpsisRVP[i]) //- couplingLoss[i];
		pfCalcsPD[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(totalHeadLossPsis[i]) - parseFloat(npshrpsisPD[i]) //- couplingLoss[i];
		pfCalcsLow[i] = parseFloat(atm) + parseFloat(staticHeadLow) - parseFloat(totalHeadLossPsis[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i];
		pfCalcsHigh[i] = parseFloat(atm) + parseFloat(staticHeadHigh) - parseFloat(totalHeadLossPsis[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i];
		// SG 6
		strainerGraphPf2[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(strainerGraphLoss2[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i];
		strainerGraphPf3[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(strainerGraphLoss3[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		strainerGraphPf4[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(strainerGraphLoss4[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		strainerGraphPf6[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(strainerGraphLoss6[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		strainerGraphPf2p[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(strainerGraphLoss2p[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		strainerGraphPf3p[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(strainerGraphLoss3p[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		strainerGraphPf4p[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(strainerGraphLoss4p[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		strainerGraphPf6p[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(strainerGraphLoss6p[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		// BVG 6
		breakawayGraphPf4[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(breakawayGraphLoss4[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		breakawayGraphPf6[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(breakawayGraphLoss6[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		breakawayGraphPf4p[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(breakawayGraphLoss4p[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
		breakawayGraphPf6p[i] = parseFloat(atm) + parseFloat(staticHead) - parseFloat(breakawayGraphLoss6p[i]) - parseFloat(npshrpsis[i]) - couplingLoss[i]
	}
	// old TVP formulas
	// var TVP = RVP * Math.pow(Math.E,(-6622.5 * ((1/((temperature*1.8021)+459.69)) - (1/559.69)))) + (.04*RVP) + (.1 * 27);
	// var TVP = ((0.7553 - (413/(temperature + 459.6))) * Math.pow(2.5, 0.5) * Math.log10(RVP)) - ((1.854 - (1.042/(temperature + 459.6))) * Math.pow(2.5, 0.5)) + (((2416/(temperature + 459.6)) - 2.013) * Math.log10(RVP)) - ((8.742/(temperature + 459.6)) + 15.64);
	// New TVP calculation uses A, B, C, and D to make looking and typing the calculation easier
	
	// RVG 1
	var RVPs = [1, 5, 10, 14, 16];
	var RVPlength = 5;
	var TVPs = new Array();
	for (var i = 0; i < RVPlength; i++){
		var A = 9.4674 - (-0.9445 * Math.log(RVPs[i]));
		var B = 5211 - (16.014 * Math.log(RVPs[i]));
		var C = 459.67;
		var D = A-((B)/(parseFloat(temperature) + parseFloat(C)));
		TVPs[i] = Math.exp(D);
	}
	
	var A = 9.4674 - (-0.9445 * Math.log(RVP));
    var B = 5211 - (16.014 * Math.log(RVP));
    var C = 459.67;
    var D = A-((B)/(parseFloat(temperature) + parseFloat(C)));
    var TVP = Math.exp(D);
	
	/**
	var VL = (atm - pfCalc)/(pfCalc - TVP);
	// The v/l ratio shown on the page
	var VLratio = 1.0/(VL + 1);
	if (VLratio < 0){
		VLratio = 0;
	}**/
	var VLs = new Array();
	var VLRVP = new Array();
	var VLPD = new Array();
	var VLLow = new Array();
	var VLHigh = new Array();
	// SG 7
	var strainerGraphVL2 = new Array();
	var strainerGraphVL3 = new Array();
	var strainerGraphVL4 = new Array();
	var strainerGraphVL6 = new Array();
	var strainerGraphVL2p = new Array();
	var strainerGraphVL3p = new Array();
	var strainerGraphVL4p = new Array();
	var strainerGraphVL6p = new Array(); // For JAMES CURVES
	// BVG 7
	var breakawayGraphVL4 = new Array();
	var breakawayGraphVL6 = new Array();
	var breakawayGraphVL4p = new Array();
	var breakawayGraphVL6p = new Array();
	// RVG 2
	var RVPVLd = new Array();
	var RVPVL1 = new Array();
	var RVPVL2 = new Array();
	var RVPVL5 = new Array();
	var RVPVL10 = new Array();
	for (var i = 0; i < loopIndex; i++){
		VLs[i] = (atm - pfCalcs[i])/(pfCalcs[i] - TVP);
		VLPD[i] = (atm - pfCalcsPD[i])/(pfCalcsPD[i] - TVP);
		VLRVP[i] = (atm - pfCalcsRVP[i])/(pfCalcsRVP[i] - TVP);
		VLLow[i] = (atm - pfCalcsLow[i])/(pfCalcsLow[i] - TVP);
		VLHigh[i] = (atm - pfCalcsHigh[i])/(pfCalcsHigh[i] - TVP);
		
		// RVG 3
		RVPVLd[i] = (atm - pfCalcs[i])/(pfCalcs[i] - TVPs[0]);
		RVPVL1[i] = (atm - pfCalcs[i])/(pfCalcs[i] - TVPs[1]);
		RVPVL2[i] = (atm - pfCalcs[i])/(pfCalcs[i] - TVPs[2]);
		RVPVL5[i] = (atm - pfCalcs[i])/(pfCalcs[i] - TVPs[3]);
		RVPVL10[i] = (atm - pfCalcs[i])/(pfCalcs[i] - TVPs[4]);
		// SG 8
		strainerGraphVL2[i] = (atm - strainerGraphPf2[i])/(strainerGraphPf2[i] - TVP);
		strainerGraphVL3[i] = (atm - strainerGraphPf3[i])/(strainerGraphPf3[i] - TVP);
		strainerGraphVL4[i] = (atm - strainerGraphPf4[i])/(strainerGraphPf4[i] - TVP);
		strainerGraphVL6[i] = (atm - strainerGraphPf6[i])/(strainerGraphPf6[i] - TVP);
		strainerGraphVL2p[i] = (atm - strainerGraphPf2p[i])/(strainerGraphPf2p[i] - TVP);
		strainerGraphVL3p[i] = (atm - strainerGraphPf3p[i])/(strainerGraphPf3p[i] - TVP);
		strainerGraphVL4p[i] = (atm - strainerGraphPf4p[i])/(strainerGraphPf4p[i] - TVP);
		strainerGraphVL6p[i] = (atm - strainerGraphPf6p[i])/(strainerGraphPf6p[i] - TVP);
		// BVG 8
		breakawayGraphVL4[i] = (atm - breakawayGraphPf4[i])/(breakawayGraphPf4[i] - TVP);
		breakawayGraphVL6[i] = (atm - breakawayGraphPf6[i])/(breakawayGraphPf6[i] - TVP);
		breakawayGraphVL4p[i] = (atm - breakawayGraphPf4p[i])/(breakawayGraphPf4p[i] - TVP);
		breakawayGraphVL6p[i] = (atm - breakawayGraphPf6p[i])/(breakawayGraphPf6p[i] - TVP);
	}
	
	//alert(" TVP: " + TVP + "\n atm: " + atm + "\n pf: " + pfCalcs[freq] + "\n V/L: " + VLs[freq] + "\n VLPD: " + VLPD[freq] + "\n npshrPD: " + npshrpsisPD[freq] + "\n npshr: " + npshrpsis[freq]);
	
	// The estimated flow shown on the page
	// var ans = q*VLratio;
	var answers = new Array();
	var answersPD = new Array();
	var answersRVP = new Array();
	var aPD = new Array();
	var aOther = new Array();
	var answersLow = new Array();
	var answersHigh = new Array();
	// RVG 4
	var RVPdA = new Array();
	var RVP1A = new Array();
	var RVP2A = new Array();
	var RVP5A = new Array();
	var RVP10A = new Array();
	// SG 9
	var strainerGraphA2 = new Array();
	var strainerGraphA3 = new Array();
	var strainerGraphA4 = new Array();
	var strainerGraphA6 = new Array();
	var strainerGraphA2p = new Array();
	var strainerGraphA3p = new Array();
	var strainerGraphA4p = new Array();
	var strainerGraphA6p = new Array(); // For JAMES CURVES
	// BVG 9
	var breakawayGraphA4 = new Array();
	var breakawayGraphA6 = new Array();
	var breakawayGraphA4p = new Array();
	var breakawayGraphA6p = new Array();
	for (var i = 0; i < loopIndex; i++){
		
		answers[i] = (qs[i]*(1.0/(VLs[i] + 1)));
		answersPD[i] = qs[i] * (1.0/(VLPD[i] + 1));
		answersRVP[i] = qs[i] * (1.0/(VLRVP[i] + 1));
		answersLow[i] = (qs[i]*(1.0/(VLLow[i] + 1)));
		answersHigh[i] = (qs[i]*(1.0/(VLHigh[i] + 1)));
		// RVG 5
		RVPdA[i] = qs[i]*(1.0/(RVPVLd[i] + 1));
		RVP1A[i] = qs[i]*(1.0/(RVPVL1[i] + 1));
		RVP2A[i] = qs[i]*(1.0/(RVPVL2[i] + 1));
		RVP5A[i] = qs[i]*(1.0/(RVPVL5[i] + 1));
		RVP10A[i] = qs[i]*(1.0/(RVPVL10[i] + 1));
		// SG 10
		strainerGraphA2[i] = qs[i]*(1.0/(strainerGraphVL2[i] + 1));
		strainerGraphA3[i] = qs[i]*(1.0/(strainerGraphVL3[i] + 1));
		strainerGraphA4[i] = qs[i]*(1.0/(strainerGraphVL4[i] + 1));
		strainerGraphA6[i] = qs[i]*(1.0/(strainerGraphVL6[i] + 1));
		strainerGraphA2p[i] = qs[i]*(1.0/(strainerGraphVL2p[i] + 1));
		strainerGraphA3p[i] = qs[i]*(1.0/(strainerGraphVL3p[i] + 1));
		strainerGraphA4p[i] = qs[i]*(1.0/(strainerGraphVL4p[i] + 1));
		strainerGraphA6p[i] = qs[i]*(1.0/(strainerGraphVL6p[i] + 1));
		// BVG 10
		breakawayGraphA4[i] = qs[i]*(1.0/(breakawayGraphVL4[i] + 1));
		breakawayGraphA6[i] = qs[i]*(1.0/(breakawayGraphVL6[i] + 1));
		breakawayGraphA4p[i] = qs[i]*(1.0/(breakawayGraphVL4p[i] + 1));
		breakawayGraphA6p[i] = qs[i]*(1.0/(breakawayGraphVL6p[i] + 1));
		// if the answer is < 0, makes it 0 since < 0 is impossible
		if (answers[i] < 0){
			answers[i] = 0;
		}
		// RVG 6
		if (RVPdA[i] < 0){
			RVPdA[i] = 0;
		}
		if (RVP1A[i] < 0){
			RVP1A[i] = 0;
		}
		if (RVP2A[i] < 0){
			RVP2A[i] = 0;
		}
		if (RVP5A[i] < 0){
			RVP5A[i] = 0;
		}
		if (RVP10A[i] < 0){
			RVP10A[i] = 0;
		}
		// SG 11
		if (strainerGraphA2[i] < 0){
			strainerGraphA2[i] = 0;
		}
		if (strainerGraphA3[i] < 0){
			strainerGraphA3[i] = 0;
		}
		if (strainerGraphA4[i] < 0){
			strainerGraphA4[i] = 0;
		}
		if (strainerGraphA6[i] < 0){
			strainerGraphA6[i] = 0;
		}
		if (strainerGraphA2p[i] < 0){
			strainerGraphA2p[i] = 0;
		}
		if (strainerGraphA3p[i] < 0){
			strainerGraphA3p[i] = 0;
		}
		if (strainerGraphA4p[i] < 0){
			strainerGraphA4p[i] = 0;
		}
		if (strainerGraphA6p[i] < 0){
			strainerGraphA6p[i] = 0;
		}
		// BVG 11
		if (breakawayGraphA4[i] < 0){
			breakawayGraphA4[i] = 0;
		}
		if (breakawayGraphA6[i] < 0){
			breakawayGraphA6[i] = 0;
		}
		if (breakawayGraphA4p[i] < 0){
			breakawayGraphA4p[i] = 0;
		}
		if (breakawayGraphA6p[i] < 0){
			breakawayGraphA6p[i] = 0;
		}
		// if the theoretical flow is < 0, correct it to 0 for more visually pleasing graph and realism
		if (qs[i] < 0){
			qs[i] = 0;
		}
		// if the V/L is < 0, you have defied the laws of physics
		if (VLs[i] < 0){
			VLs[i] = 0;
		}
		if (VLPD[i] < 0){
			VLPD[i] = 0;
		}
		if (VLRVP[i] < 0){
			VLRVP[i] = 0;
		}
		// Again, laws of fluid dynamics are broken if answer > q
		if (answers[i] > qs[i]){
			answers[i] = qs[i];
		}
		if (answersPD[i] > qs[i]){
			answersPD[i] = qs[i];
		}
		if (answersRVP[i] > qs[i]){
			answersRVP[i] = qs[i];
		}
		if (i > 0){
			if (answers[i-1] > answers[i]){
				//if (aOther.length < 10){
				//	aOther = answers.slice(0,i+1); 
				//}
				answers[i] = parseFloat(answers[i-1]) + (0.1*Math.log(i));
			}
			if (answersPD[i-1] > answersPD[i]){
				//if (aPD.length < 10){
				//	aPD = answersPD.slice(0,i+1);
				//}
				answersPD[i] = answersPD[i-1] + (0.1*Math.log(i));
			}
			if (answersRVP[i-1] > answersRVP[i]){
				answersRVP[i] = answersRVP[i-1] + (0.1*Math.log(i));
			}
			if (answersLow[i-1] > answersLow[i]){
				answersLow[i] = answersLow[i-1] + (0.1*Math.log(i));
			}
			if (answersHigh[i-1] > answersHigh[i]){
				answersHigh[i] = answersHigh[i-1] + (0.1*Math.log(i));
			}
			// RVG 7
			if (RVPdA[i-1] > RVPdA[i]){
				RVPdA[i] = RVPdA[i-1] + (0.1*Math.log(i));
			}
			if (RVP1A[i-1] > RVP1A[i]){
				RVP1A[i] = RVP1A[i-1] + (0.1*Math.log(i));
			}
			if (RVP2A[i-1] > RVP2A[i]){
				RVP2A[i] = RVP2A[i-1] + (0.1*Math.log(i));
			}
			if (RVP5A[i-1] > RVP5A[i]){
				RVP5A[i] = RVP5A[i-1] + (0.1*Math.log(i));
			}
			if (RVP10A[i-1] > RVP10A[i]){
				RVP10A[i] = RVP10A[i-1] + (0.1*Math.log(i));
			}
			// SG 12
			if (strainerGraphA2[i-1] > strainerGraphA2[i]){
			strainerGraphA2[i] = strainerGraphA2[i-1] + (0.1*Math.log(i));
			}
			if (strainerGraphA3[i-1] > strainerGraphA3[i]){
			strainerGraphA3[i] = strainerGraphA3[i-1] + (0.1*Math.log(i));
			}
			if (strainerGraphA4[i-1] > strainerGraphA4[i]){
			strainerGraphA4[i] = strainerGraphA4[i-1] + (0.1*Math.log(i));
			}
			if (strainerGraphA6[i-1] > strainerGraphA6[i]){
			strainerGraphA6[i] = strainerGraphA6[i-1] + (0.1*Math.log(i));
			}
			if (strainerGraphA2p[i-1] > strainerGraphA2p[i]){
			strainerGraphA2p[i] = strainerGraphA2p[i-1] + (0.1*Math.log(i));
			}
			if (strainerGraphA3p[i-1] > strainerGraphA3p[i]){
			strainerGraphA3p[i] = strainerGraphA3p[i-1] + (0.1*Math.log(i));
			}
			if (strainerGraphA4p[i-1] > strainerGraphA4p[i]){
			strainerGraphA4p[i] = strainerGraphA4p[i-1] + (0.1*Math.log(i));
			}
			if (strainerGraphA6p[i-1] > strainerGraphA6p[i]){
			strainerGraphA6p[i] = strainerGraphA6p[i-1] + (0.1*Math.log(i));
			}
			// BVG 12
			if (breakawayGraphA4[i-1] > breakawayGraphA4[i]){
				breakawayGraphA4[i] = breakawayGraphA4[i-1] + (0.1*Math.log(i));
			}
			if (breakawayGraphA6[i-1] > breakawayGraphA6[i]){
				breakawayGraphA6[i] = breakawayGraphA6[i-1] + (0.1*Math.log(i));
			}
			if (breakawayGraphA4p[i-1] > breakawayGraphA4p[i]){
				breakawayGraphA4p[i] = breakawayGraphA4p[i-1] + (0.1*Math.log(i));
			}
			if (breakawayGraphA6p[i-1] > breakawayGraphA6p[i]){
				breakawayGraphA6p[i] = breakawayGraphA6p[i-1] + (0.1*Math.log(i));
			}
		}
	}
	// Adds a fade animation when the answer shows up
	$('#resultText').fadeOut(200, function() {
		// toFixed(n) rounds the answer to n decimal places
        $(this).text(parseFloat(answers[freq-1]).toFixed(6) + " GPM").fadeIn("slow");
    });
	$('#result2Text').fadeOut(200, function() {
        $(this).text((parseFloat(VLs[freq-1]*100).toFixed(6)) + "%").fadeIn("slow");
    });
	$('#result3Text').fadeOut(200, function() {
        $(this).text(parseFloat(qs[freq-1]).toFixed(4) + " GPM").fadeIn("slow");
    });
	$('#result4Text').fadeOut(200, function() {
        $(this).text(parseFloat(npshrpsis[freq-1] * 2.3066587368787).toFixed(4) + " ft").fadeIn("slow");
    });

	qs[0] = 0; // to make this look better on the graph
	npshrpsisPD[59] = 22;
	dataArray[0] = freqs.slice();
	for (var i = 0; i < freqs.length; i++){
		freqs[i] = freqs[i] * 30;
	}
	// graphs the theoretical vs estimated flow
	$(".graph").fadeIn("fast");
	$(".graph").append("<canvas id=\"flowChart\" width=\"80%\" height=\"30%\"></canvas>");
	var ctx = $("#flowChart");
	if (!toggled){
		$("#dataButton").toggle();
		toggled = true;
	}
	dataArray[1] = freqs;
	dataArray[2] = npshrpsis;
	dataArray[3] = npshrpsisPD;
	dataArray[4] = npshrpsisRVP;
	dataArray[5] = answers;
	dataArray[6] = answersPD;
	dataArray[7] = answersRVP;
	dataArray[8] = qs;
	dataArray[9] = VLs;
	dataArray[10] = VLPD;
	dataArray[11] = VLRVP;
	dataArray[12] = answersLow;
	dataArray[13] = answersHigh;
	dataArray[14] = breakawayGraphA4;
	dataArray[15] = breakawayGraphA6;
	dataArray[16] = breakawayGraphA4p;
	dataArray[17] = breakawayGraphA6p;
	dataArray[18] = strainerGraphA2;
	dataArray[19] = strainerGraphA3;
	dataArray[20] = strainerGraphA4;
	dataArray[21] = strainerGraphA6;
	dataArray[22] = strainerGraphA2p;
	dataArray[23] = strainerGraphA3p;
	dataArray[24] = strainerGraphA4p;
	dataArray[25] = strainerGraphA6p;
	dataArray[26] = strainerGraphLoss2;
	dataArray[27] = strainerGraphLoss3;
	dataArray[28] = strainerGraph4;
	dataArray[29] = strainerGraph6;
	dataArray[30] = strainerGraphLoss2p;
	dataArray[31] = strainerGraphLoss3p;
	dataArray[32] = strainerGraphLoss4p;
	dataArray[33] = strainerGraphLoss6p;
	dataArray[34] = breakawayGraph4;
	dataArray[35] = breakawayGraph6;
	dataArray[36] = breakawayGraph4p;
	dataArray[37] = breakawayGraph6p;
	dataArray[38] = headLosses;
	dataArray[39] = RVPdA;
	dataArray[40] = RVP1A;
	dataArray[41] = RVP2A;
	dataArray[42] = RVP5A;
	dataArray[43] = RVP10A;
	dataArray[44] = couplingLoss;
	var myChart = new Chart(ctx, {
		// the type of graph
		type: 'line',
		// graphs x-axis then y-axis
		data: {
			labels: dataArray[0],  // CHANGE TO freqs later
			datasets: [
			{
				// name shown in legend
				label: 'Theoretical Flow',
				// array of q values
				data: qs,
				// the coloring under the curve
				backgroundColor: [
					'rgba(0,19,66,0.05)' // Change to (0,19,66,.01) to fix
				],
				// NOTE: hex colors MUST use the 6-digit format in chart.js
				// color of the line connecting the points
				borderColor: [
					'#001342'
				],
				// thickness of the line connecting the points
				borderWidth: 2,
				// color of the points
				pointBackgroundColor: '#001342'
			},
			{
				label: 'Flow no Breakaway Valve', // Flow with Current Setup
				data: answers,
				backgroundColor: [
					'rgba(255,185,29,0.1)'
				],
				borderColor: [
					'rgb(255,185,29)'
				],
				borderWidth: 2,
				pointBackgroundColor: 'rgb(255,185,29)'
			},
			
			// RVG 8
			// SG 13	
			/*
			{
				label: 'Flow with 2" Strainer',
				data: strainerGraphA2,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#f7a3d7'
				],
				borderWidth: 1,
				pointBackgroundColor: '#f7a3d7'
			},
			{
				label: 'Flow with 3" Strainer',
				data: strainerGraphA3,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#24bbd3'
				],
				borderWidth: 1,
				pointBackgroundColor: '#24bbd3'
			},
			{
				label: 'Flow with 4" Strainer',
				data: strainerGraphA4,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#f5ed80'
				],
				borderWidth: 1,
				pointBackgroundColor: '#f5ed80'
			},
			{
				label: 'Flow with 6" Strainer',
				data: strainerGraphA6,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#078dd9'
				],
				borderWidth: 1,
				pointBackgroundColor: '#078dd9'
			},
			{
				label: 'Flow with 2" Strainer in parallel',
				data: strainerGraphA2p,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#d11715'
				],
				borderWidth: 1,
				pointBackgroundColor: '#d11715'
			},
			{
				label: 'Flow with 3" Strainer in parallel',
				data: strainerGraphA3p,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#60b442'
				],
				borderWidth: 1,
				pointBackgroundColor: '#60b442'
			},
			{
				label: 'Flow with 4" Strainer in parallel',
				data: strainerGraphA4p,backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#a01e3d'
				],
				borderWidth: 1,
				pointBackgroundColor: '#a01e3d'
			},
			{
				label: 'Flow with 6" Strainer in parallel',
				data: strainerGraphA6p,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#f69219'
				],
				borderWidth: 1,
				pointBackgroundColor: '#f69219'
			},	*/
			/*
			{
				label: '0 ft',
				//data: [{
				//	x: qs,
				//y: npshrpsisPD}],
				data: answersLow,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#d11715'
				],
				borderWidth: 3,
				pointBackgroundColor: '#d11715'
			},
			{
				label: '3 ft',
				data: answers,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#24bbd3'
				],
				borderWidth: 3,
				pointBackgroundColor: '#24bbd3'
			},
			{
				label: '6 ft',
				data: answersHigh,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#f5ed80'
				],
				borderWidth: 3,
				pointBackgroundColor: '#f5ed80'
			},*/
			// BVG 13
			/*
			{
				label: '4" Breakaway Valve',
				data: breakawayGraphA4,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#f7a3d7'
				],
				borderWidth: 1,
				pointBackgroundColor: '#f7a3d7'
			},
			{
				label: '6" Breakaway Valve',
				data: breakawayGraphA6,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#24bbd3'
				],
				borderWidth: 1,
				pointBackgroundColor: '#24bbd3'
			},
			{
				label: '2 x 4" Breakaway Valve',
				data: breakawayGraphA4p,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#f5ed80'
				],
				borderWidth: 1,
				pointBackgroundColor: '#f5ed80'
			},
			{
				label: '2 x 6" Breakaway Valve',
				data: breakawayGraphA6p,
				backgroundColor: [
					'rgba(0,19,66,0.0)' // Change to (0,19,66,.01) to fix
				],
				borderColor: [
					'#078dd9'
				],
				borderWidth: 1,
				pointBackgroundColor: '#078dd9'
			},*/
			]
		},
			
		options: {
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Flow (GPM)' // Flow (GPM)
					},
					ticks: {
						//suggestedMax: 20,
						//stepSize: 2
					}
				}],
				xAxes: [{
					//type: "linear",
					display: true,
					position: 'bottom',
					scaleLabel: {
						display: true,
						labelString: 'Frequency (Hz)' // Frequency (Hz)
					},
					ticks: {
						callback: function(value, index, values){
							return value;
						},
						autoSkip: true,
						maxTicksLimit: 8
						//stepSize: 25,
						//max: 600,
						//min: 0
					}
				}],
			},
			/*
			elements: {
				point:{
					radius: 0
				}
			}*/
		}
	});
	// autoscrolls to the bottom of the page
	$('html, body').animate({scrollTop:$(document).height()}, 200);
}

function displayData(){
	var outputString = new Array();
	outputString.push("<div>");
	createOutputString(true, outputString);
	// finishes html stack
	outputString.push("</div>")
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

function createOutputString(isHTML, outputString){
	var begin = "";
	var end = "";
	if(isHTML){
		begin = "<div>"
		end = "</div>"
	}
	outputString.push(begin + " Frequency (Hz)," + end + dataArray[0].join());
	outputString.push(begin + "\n Speed (RPM)," + end + dataArray[1].join());
	outputString.push(begin + "\n NPSHr (Pump + Impeller) ft," + end + dataArray[2].join());
	outputString.push(begin + "\n NPSHr (PD Pump Only) ft," + end + dataArray[3].join());
	outputString.push(begin + "\n NPSHr (RVP Pump + Impeller + Inducer) ft," + end + dataArray[4].join());
	outputString.push(begin + "\n Flow (Pump + Impeller) GPM," + end + dataArray[5].join());
	outputString.push(begin + "\n Flow (PD Pump Only) GPM," + end + dataArray[6].join());
	outputString.push(begin + "\n Flow (RVP Pump + Impeller + Inducer) GPM," + end + dataArray[7].join());
	outputString.push(begin + "\n Flow (0 ft above center line) GPM," + end + dataArray[12].join());
	outputString.push(begin + "\n Flow (6 ft above center line) GPM," + end + dataArray[13].join());
	outputString.push(begin + "\n Flow (With 4\" Breakaway Valve) GPM," + end + dataArray[14].join());
	outputString.push(begin + "\n Flow (With 6\" Breakaway Valve) GPM," + end + dataArray[15].join());
	outputString.push(begin + "\n Flow (With two 4\" Breakaway Valves in Parallel) GPM," + end + dataArray[16].join());
	outputString.push(begin + "\n Flow (With two 6\" Breakaway Valves in Parallel) GPM," + end + dataArray[17].join());
	outputString.push(begin + "\n Flow (With 2\" Strainers) GPM," + end + dataArray[18].join());
	outputString.push(begin + "\n Flow (With 3\" Strainers) GPM," + end + dataArray[19].join());
	outputString.push(begin + "\n Flow (With 4\" Strainers) GPM," + end + dataArray[20].join());
	outputString.push(begin + "\n Flow (With 6\" Strainers) GPM," + end + dataArray[21].join());
	outputString.push(begin + "\n Flow (With two 2\" Strainers in Parallel) GPM," + end + dataArray[22].join());
	outputString.push(begin + "\n Flow (With two 3\" Strainers in Parallel) GPM," + end + dataArray[23].join());
	outputString.push(begin + "\n Flow (With two 4\" Strainers in Parallel) GPM," + end + dataArray[24].join());
	outputString.push(begin + "\n Flow (With two 6\" Strainers in Parallel) GPM," + end + dataArray[25].join());
	outputString.push(begin + "\n Head Loss (With 4\" Breakaway Valve) ft," + end + dataArray[34].join());
	outputString.push(begin + "\n Head Loss (With 6\" Breakaway Valve) ft," + end + dataArray[35].join());
	outputString.push(begin + "\n Head Loss (With two 4\" Breakaway Valves in Parallel) ft," + end + dataArray[36].join());
	outputString.push(begin + "\n Head Loss (With two 6\" Breakaway Valves in Parallel) ft," + end + dataArray[37].join());
	outputString.push(begin + "\n Head Loss (With 2\" Strainers) ft," + end + dataArray[26].join());
	outputString.push(begin + "\n Head Loss (With 3\" Strainers) ft," + end + dataArray[27].join());
	outputString.push(begin + "\n Head Loss (With 4\" Strainers) ft," + end + dataArray[28].join());
	outputString.push(begin + "\n Head Loss (With 6\" Strainers) ft," + end + dataArray[29].join());
	outputString.push(begin + "\n Head Loss (With two 2\" Strainers in Parallel) ft," + end + dataArray[30].join());
	outputString.push(begin + "\n Head Loss (With two 3\" Strainers in Parallel) ft," + end + dataArray[31].join());
	outputString.push(begin + "\n Head Loss (With two 4\" Strainers in Parallel) ft," + end + dataArray[32].join());
	outputString.push(begin + "\n Head Loss (With two 6\" Strainers in Parallel) ft," + end + dataArray[33].join());
	outputString.push(begin + "\n Head Loss (All Fittings) ft," + end + dataArray[38].join());
	outputString.push(begin + "\n Theoretical Flow GPM," + end + dataArray[8].join());
	outputString.push(begin + "\n V/L (Pump + Impeller)," + end + dataArray[9].join());
	outputString.push(begin + "\n V/L (PD Pump Only)," + end + dataArray[10].join());
	outputString.push(begin + "\n V/L (RVP Pump + Impeller + Inducer)," + end + dataArray[11].join());
	outputString.push(begin + "\n Flow (With 1 RVP fluid) GPM," + end + dataArray[39].join());
	outputString.push(begin + "\n Flow (With 5 RVP fluid) GPM," + end + dataArray[40].join());
	outputString.push(begin + "\n Flow (With 10 RVP fluid) GPM," + end + dataArray[41].join());
	outputString.push(begin + "\n Flow (With 14 RVP fluid) GPM," + end + dataArray[42].join());
	outputString.push(begin + "\n Flow (With 16 RVP fluid) GPM," + end + dataArray[43].join());
	outputString.push(begin + "\n Head Loss (With 4\" Coupling)," + end + dataArray[44].join());
}

// copy to clipboard button
function copy(){
	// copies text to clipboard
	copyToClipboard(document.getElementById("popupText"));
	// fires off the copied to clipboard animated message
	e1 = $('.copyMessage');
	e1.addClass('animate');
	e1.css('visibility', 'visible');
	e1.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
	function (e) {
		e1.removeClass('animate');
		e1.css('visibility', 'hidden');
	});
	// autoscrolls to the bottom of the page
	$('html, body').animate({scrollTop:$(document).height()}, 1);

}
// https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery <- The Stack overflow answer here
function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}
// closes out of output html popup
function dismissPopup(){
	$("#popupText").empty();
	$('.copyMessage').removeClass('animate');
	
}

function downloadCSV(){
	var outputString = new Array();
	createOutputString(false, outputString);
	var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(outputString);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'pumpData.csv';
    hiddenElement.click();
}

// the angularJS controller used to generate the list of fittings and lines (saves a lot of copy and pasting)
angular.module('flowApp', []).controller('FlowListController', function() {
    var flowList = this;
    flowList.flows = [
		{text:'1', show: true},
		{text:'2', show: false},
		{text:'3', show: false}];
});

/** Function I use that is in common.js
An example call would be var matrix = createMatrix(5,4)
The variable matrix will be:
		[], [], [], []
		[], [], [], []
		[], [], [], []
		[], [], [], []
		[], [], [], []
		
The [] represents an empty array.  This function is a thing since
declaring matrices in javascript is annoying.

Also works with one argument (or 3+ but I wouldn't do that) to create an n x 1 matrix (an array).
function createMatrix(length) {
    var arr = new Array(length || 0),
        i = length;
	// recursively creates an array at each index of the originally produced array 
    if (arguments.length > 1) {
		// Type conversion from arguments array to a regular array (which are apparently different)
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createMatrix.apply(this, args);
    }
    return arr;
}
**/
