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
	imgArray[o].src = 'schem/logo.jpg';
}
// loads images for the schematic
imgArray[0].src = 'schem/180.png';
imgArray[1].src = 'schem/180.png';
imgArray[2].src = 'schem/angle valve.PNG';
imgArray[3].src = 'schem/ball valve.PNG';
imgArray[4].src = 'schem/ball valve.PNG';
imgArray[5].src = 'schem/ball valve.PNG';
imgArray[6].src = 'schem/Branch flow.png';
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

  /**
	* getImage(sender): retrieves an image in the above image array depending on the index selected 
	* under the fittings info section of the webpage.
	*
	* sender - the dropdown menu which activated the function
	**/

function getImage(sender){
	// The if statement commented out below would make the image appear in the schematic builder area
	// only when the fitting and the fitting row is different
	//if( (!imgAdder.includes(imgArray[sender.selectedIndex].src) || imgAdder.length  == 0)){
		// checks if the fitting is already on the schematic
		if((!imgSource.includes(sender.id) || imgSource.length == 0)){
			$("#dropArea").append("<img class=\"ui-widget-content fittingImg\" id= img" + sender.id + "></img>");
			document.getElementById("img" + sender.id).src = imgArray[sender.selectedIndex].src;
			imgAdder.push(imgArray[sender.selectedIndex].src);
			imgSource.push(sender.id);
			for (var i = 0; i < imgSource.length; i++){
				$("#img" + imgSource[i]).draggable({ opacity: 0.6, snap: true, containment: "#dropArea", scroll: false })
			}
		} else {
			var imgSrc = document.getElementById("img" + sender.id).src;
			document.getElementById("img" + sender.id).src = imgArray[sender.selectedIndex].src;
			imgAdder.push(imgArray[sender.selectedIndex].src);
			var usedPic = $.inArray(imgSrc, imgAdder);
			imgAdder.splice(usedPic, 1);
		}
		fNums.push(document.getElementById("fNum" + i).value);
	//}
}

$( function() {
    $( "#tankPic" ).draggable({  opacity: 0.6, snap: true, containment: "#dropArea", scroll: false });
    $( "#pumpPic" ).draggable({ opacity: 0.6, snap: true, containment: "#dropArea", scroll: false });
} );

function addLine(){
	lines.push(true);
	$("#lineLosses").append(" <div class=\"col-sm-4 line" + lines.length + "\"><label for=\"pDiam" + lines.length + "\">Diameter of Pipe (Inches)</label><br>	<select class=\"selectpicker col-sm-12\" style=\"height: 4.5ex\" id=\"pDiam" + lines.length + "\"> <option>0</option> <option>2</option> <option>3</option> <option>4</option> <option>6</option> </select></div> <div class=\"col-sm-3 line" + lines.length + "\"> <label for=\"pLength" + lines.length + "\">Length of Pipe</label> <div class=\"input-group\"> <input type=\"text\" class=\"form-control\" id=\"pLength" + lines.length + "\"> <span class=\"input-group-addon\">ft</span> </div> </div>  <div class=\"col-sm-3 line" + lines.length + "\"> <label for=\"roughness" + lines.length + "\">Roughness of Pipe</label>  <div class=\"input-group\"> <input type=\"text\" class=\"form-control\" id=\"roughness" + lines.length + "\"> <span class=\"input-group-addon\">in</span> </div> </div> <div class=\"col-sm-1 bottomPad line" + lines.length + "\"> <p>&nbsp;</p> <button type=\"button\" class=\"btn btn-xs btn-default customBtn\" onclick=\"deleteLine(" + lines.length + ")\"> <span class=\"glyphicon glyphicon-remove\"></span>	</button> </div>");	
	}
function addFitting(){
	fittings.push(true);
	$("#fittingsection").append("  <div class=\"col-sm-4 fitting" + fittings.length + "\"> <label for=\"fType" + fittings.length + "\">Type of Fitting</label><br> <select class=\"selectpicker col-sm-12\" style=\"height: 4.5ex\" id=\"fType" + fittings.length + "\" onchange=\"getImage(this)\" name=" + fittings.length + "> <option>180°  Return Bend, Flanged</option> <option>180°  Return Bend, Threaded</option> <option>Angle Valve Fully Open</option> <option>Ball Valve </option> <option>Ball Valve (1/2 Closed)</option> <option>Ball Valve (2/3 Closed)</option> <option>Branch Flow, Threaded</option> <option>Butterfly Valve</option> <option>Close Return Bend</option> <option>Gate Valve  </option> <option>Gate Valve (1/2 closed)</option> <option>Gate Valve (1/4 closed)</option> <option>Gate Valve (3/4 closed)</option> <option>Globe Valve</option> <option>Long Radius 45° Flanged</option> <option>Long Radius 90° Flanged</option> <option>Long Radius 90° Threaded</option> <option>Pipe Entrance (inward Projecting)</option> <option>Pipe Entrance (Sharp Edged)</option> <option>Pipe Exit</option> <option>Plug Valve 3-Way Thru-Flow</option> <option>Plug Valve Branch Flow</option> <option>Plug Valve Straightaway</option> <option>Regular 45° Threaded</option> <option>Regular 90° Flanged </option> <option>Regular 90° Threaded </option> <option>Standard Elbow 45°</option> <option>Standard Elbow Long Radius 90°</option> <option>Sudden Expander</option> <option>Sudden Reducer</option> <option>Swing Check Valve</option> <option>Tees, Branch Flow, Flanged</option> <option>Tees, Line Flow, Flanged</option> <option>Tees, Line Flow, Threaded</option> <option>Threaded Union</option> </select> </div> <div class=\"col-sm-3 fitting" + fittings.length + "\"> <label for=\"fDiam" + fittings.length + "\">Diameter (Inches)</label><br> <select class=\"selectpicker col-sm-12\" style=\"height: 4.5ex\" id=\"fDiam" + fittings.length + "\"> <option>2</option> <option>3</option> <option>4</option> <option>6</option> </select> </div> <div class=\"col-sm-3 fitting" + fittings.length + "\"> <div class=\"form-group\"> <label for=\"fNum" + fittings.length + "\">Number of Fittings</label> <input type=\"text\" class=\"form-control\" id=\"fNum" + fittings.length + "\"> </div> </div> </div> <div class=\"col-sm-1 fitting" + fittings.length + "\"> <div class=\"col-xs-12\">&nbsp;</div> <label class=\"checkbox-inline fitting" + fittings.length + "\"> <input type=\"checkbox\" value=\"\" id=\"check" + fittings.length + "\">Parallel</label> </div> <div class=\"col-sm-1 bottomPad fitting" + fittings.length + "\"> <p>&nbsp;</p> <button type=\"button\" class=\"btn btn-xs btn-default customBtn\" onclick=\"deleteFitting(" + fittings.length +")\"> <span class=\"glyphicon glyphicon-remove\"></span>	</button> </div>");
}
function deleteLine(line){
	$(".line" + line).remove();	
	lines[line - 1] = false;
}
function deleteFitting(fit){
	$(".fitting" + fit).remove();
	$("#imgfType" + fit).remove();
	fittings[fit - 1] = false;
}

function checkForm() {
	var returnValue = true;
	var numRegex = /(^[0-9]+$|^[0-9]*\.[0-9]+$)/g;
	if($('input[name="pumps"]:checked').val() == null){
		document.getElementById("alertMessage").innerHTML =  "Please select a pump under \"Pump Options.\"";
		if(!$("#alert").is(":visible")){
			$("#alert").fadeIn("slow");
		}
		returnValue =  false;
	}
	
	$('.checkVals input[type="text"]').each(function(){
        if (!this.value.match(numRegex)){
			this.style = "border-color: red; box-shadow: inset 0 1px 1px rgba(0,0,0,0.075), 0 0 7px rgba(200,15,15,0.6);"
			document.getElementById("alertMessage").innerHTML =  "Please change the highlighted values above.";
			if(!$("#alert").is(":visible")){
				$("#alert").fadeIn("slow");
			}
            returnValue =  false;
		} else {
			this.style = "border-color: none; box-shadow: none;"
		}			
	});
	
	
	if($("#alert").is(":visible") && returnValue){
		$("#alert").fadeOut("slow");
	}
	
	return returnValue;
}

function calculate() {
	var canCalc = true;
	canCalc = checkForm();
	
	if (!canCalc){
		return;
	}
	
	var height = $("#height").val();
	var atm = $("#atm").val();
	var dPressure = $("#dPressure").val();
	var tPressure = $("#tPressure").val();
	var temperature = $("#temperature").val();
	var RVP = $("#RVP").val();
	var pump = $('input[name="pumps"]:checked').val();
	var freq = document.getElementById("frequency").value;
	var density = document.getElementById("fluid_density").value;
	var npshrft = (pump * Math.pow(((freq * 30.0)/1800.0), 1.5)) + 0.5;
	var npshrps = (npshrft * 32.2 * density) / 144.0;
	var kinematicViscosity = document.getElementById("kViscosity").value;
	var pipesDValue = new Array();
	var roughnesses = new Array();
	var pipeLength = new Array();
	for (var i = 0; i < lines.length; i++){
		if(lines[i]){
			pipesDValue.push($("#pDiam" + (i + 1)).find("option:selected").text());
			roughnesses.push(document.getElementById("roughness" + (i + 1)).value);
			pipeLength.push(document.getElementById("pLength" + (i + 1)).value);
		}
	}
	var roughRatio = new Array();
	for(var i = 0; i < pipesDValue.length; i++){
		roughRatio.push(roughnesses[i]/pipesDValue[i]);
	}
	var pumpVelocity = 3.8;
	var q;
	// RVP flowrate
	if (pump == 3){
		q = (3.83 * freq) - (2.39 * dPressure) + 0.8155;
	} else if (pump == 8.5){
		pumpVelocity = 8.7
		// 4" flowrate
		q = freq * pumpVelocity;
	} else {
		q = (3.853 * freq) - (0.1585 * dPressure) + 1.0701;
	}
	
	var pq = q/2;
	
	var pipeAreas = new Array();
	for (var i = 0; i < pipesDValue.length; i++){
		pipeAreas.push(Math.PI * Math.pow((pipesDValue[i])/2.0, 2));
	}
	var k = new Array();
	for(var i = 0; i < pipeAreas.length; i++){
		k.push(((pipeLength[i] * 12) / pipesDValue[i]) * (1.325/Math.pow(Math.log(roughnesses[i]/(3.7*pipesDValue[i])+(5.74/Math.pow((((q*0.00223)/(pipeAreas[i]/144))*pipesDValue[i]/12)/kinematicViscosity, 0.9))),2)));
	}	
	
	var fittingsD = new Array();
	var fittingsT = new Array();
	var fittingsDValue = new Array();
	var fNums = new Array();
	for (var i = 1; i < (fittings.length + 1); i++){
		if(fittings[i-1]){
			fittingsD.push(document.getElementById("fDiam" + i).selectedIndex);
			fittingsT.push(document.getElementById("fType" + i).selectedIndex);
			fittingsDValue.push($("#fDiam" + i).find("option:selected").text());
			fNums.push(document.getElementById("fNum" + i).value);
		}
	}
	
	//var fittingsD = [document.getElementById("fDiam1").selectedIndex, document.getElementById("fDiam2").selectedIndex, document.getElementById("fDiam3").selectedIndex, document.getElementById("fDiam4").selectedIndex, document.getElementById("fDiam5").selectedIndex, document.getElementById("fDiam6").selectedIndex];
	//var fittingsT = [document.getElementById("fType1").selectedIndex, document.getElementById("fType2").selectedIndex, document.getElementById("fType3").selectedIndex, document.getElementById("fType4").selectedIndex, document.getElementById("fType5").selectedIndex, document.getElementById("fType6").selectedIndex];
	//var fittingsDValue = [document.getElementById("fDiam1").options[document.getElementById("fDiam1").selectedIndex].text, document.getElementById("fDiam2").options[document.getElementById("fDiam2").selectedIndex].text,document.getElementById("fDiam3").options[document.getElementById("fDiam3").selectedIndex].text,document.getElementById("fDiam4").options[document.getElementById("fDiam4").selectedIndex].text,document.getElementById("fDiam5").options[document.getElementById("fDiam5").selectedIndex].text,document.getElementById("fDiam6").options[document.getElementById("fDiam6").selectedIndex].text];
 	var matrix = [[0.2,	0.2,	0.2	,0.2],[1.5,	1.5	,1.5,	1.5],[2	,2	,2	,2],[0.06,	0.05,	0.05	,0.05],	[5.5,	5.5	,5.5,	5.5],[210,	210,	210,	210],[2	,2	,2	,2],[0.86,	0.81	,0.77,	0.68],	[0.95	,0.9	,0.85	,0.75],	[0.15	,0.14,	0.14,	0.12],	[2.1	,2.1,	2.1	,2.1],	[0.26,	0.26	,0.26	,0.26],	[17	,17	,17	,17],	[6.5	,6.1,	5.8,	5.1],	[0.2	,0.2	,0.2,	0.2],	[0.2,	0.2	,0.2,	0.2],	[0.7	,0.7,	0.7,	0.7],	[0.78,	0.78	,0.78,	0.78],	[0.5,	0.5	,0.5,	0.5],	[1	,1	,1	,1],	[0.57	,0.54,	0.51,	0.45],	[1.71,	1.62	,1.53	,1.35],	[0.34	,0.32,	0.31	,0.27],	[0.4,	0.4	,0.4	,0.4],	[0.3	,0.3,	0.3	,0.3],	[1.5	,1.5	,1.5,	1.5],	[0.3	,0.29,	0.27,	0.24],	[0.3	,0.29,	0.27,	0.24],	[0.3	,0.19,	0.3	,0],	[0,	0.275,	0.2	,0.275],	[2,2	,2,	2],	[1,	1,	1,	1],	[0.2,	0.2	,0.2,	0.2],	[0.9	,0.9,	0.9,	0.9],	[0.08,	0.08	,0.08,	0.08]];
	
	var kFittings = new Array();
	var p = 0;
	while (p < fittingsT.length){
		kFittings.push(matrix[fittingsT[p]][fittingsD[p]] * fNums[p]);
		p += 1;
	}
	var fitParallel = new Array();
	var kDiams = [0 ,0 ,0 ,0];
	var pkDiams = [0 ,0 ,0 ,0];
	
	for(var i = 0; i < fittingsDValue.length; i++){
		if($("#check" + (i+1)).is(":checked")){
			fitParallel[i] = true;
		} else {
			fitParallel[i] = false;
		}
	}
	for(var i = 0; i < pipesDValue.length; i++){
		if(pipesDValue[i] == 2){
			kDiams[0] += k[i];			
		} else if (pipesDValue[i] == 3){
			kDiams[1] += k[i];
		} else if (pipesDValue[i] == 4){
			kDiams[2] += k[i];
		} else if (pipesDValue[i] == 6){
			kDiams[3] += k[i];
		}
	}
	for(var i = 0; i < fittingsDValue.length; i++){
		if(!fitParallel[i]){
			if(fittingsDValue[i] == 2){
				kDiams[0] += kFittings[i];			
			} else if (fittingsDValue[i] == 3){
				kDiams[1] += kFittings[i];
			} else if (fittingsDValue[i] == 4){
				kDiams[2] += kFittings[i];
			} else if (fittingsDValue[i] == 6){
				kDiams[3] += kFittings[i];
			}
		} else {
			if(fittingsDValue[i] == 2){
				pkDiams[0] += kFittings[i];			
			} else if (fittingsDValue[i] == 3){
				pkDiams[1] += kFittings[i];
			} else if (fittingsDValue[i] == 4){
				pkDiams[2] += kFittings[i];
			} else if (fittingsDValue[i] == 6){
				pkDiams[3] += kFittings[i];
			}
		}
	}
	
	var StrainerDValue = document.getElementById("sDiam").options[document.getElementById("sDiam").selectedIndex].text;
	var BreakawayDValue = document.getElementById("bDiam").options[document.getElementById("bDiam").selectedIndex].text;
	var breakawayNum = document.getElementById("bNum").value;
	var StrainerNum = document.getElementById("sNum").value;
	var strainerCheck = $("#checkStrainer").is(":checked");
	var breakawaycheck = $("#checkBreak").is(":checked");
	var BPressureDrop;
	if(!breakawaycheck){
		if (BreakawayDValue != 4){
			BPressureDrop = (0.000007 * Math.pow(q, 2)) + (-0.00001*q) + -0.0013;
		} else {
			BPressureDrop = (0.00001 * Math.pow(q, 2)) + (-0.0005*q) + 0.0332;
		}
	} else {
		if (BreakawayDValue != 4){
			BPressureDrop = (0.000007 * Math.pow(pq, 2)) + (-0.00001*pq) + -0.0013;
		} else {
			BPressureDrop = (0.00001 * Math.pow(pq, 2)) + (-0.0005*pq) + 0.0332;
		}
	}
	BPressureDrop = BPressureDrop * breakawayNum;
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
	var SPressureDrop;
	if(!strainerCheck){
		SPressureDrop = (resistance * Math.pow(q,2)) * StrainerNum;
	} else{
		SPressureDrop = (resistance * Math.pow(pq,2)) * StrainerNum;
	}
	
	// will eventually become velocities later
	var velocity = [2,3,4,6];
	for (var i = 0; i < velocity.length; i++){
		velocity[i] = (q*0.00223)/(Math.PI * Math.pow(velocity[i]/24,2));
	}
	var headVelocity = [0,0,0,0];
	for (var i = 0; i < headVelocity.length; i++){
		headVelocity[i] = (Math.pow(velocity[i], 2))/(2*32.2);
	}
	var headLossF = 0;
	for(var i = 0; i < headVelocity.length; i++){
		headLossF += kDiams[i] * headVelocity[i];
	}
	var headLossPsi = (headLossF * density * 32.2) / 144.0;
	
	var pvelocity = [2,3,4,6];
	for (var i = 0; i < pvelocity.length; i++){
		pvelocity[i] = (pq*0.00223)/(Math.PI * Math.pow(pvelocity[i]/24,2));
	}
	var pheadVelocity = [0,0,0,0];
	for (var i = 0; i < pheadVelocity.length; i++){
		pheadVelocity[i] = (Math.pow(pvelocity[i], 2))/(2*32.2);
	}
	var pheadLossF = 0;
	for(var i = 0; i < pheadVelocity.length; i++){
		pheadLossF += pkDiams[i] * pheadVelocity[i];
	}
	var pheadLossPsi = (pheadLossF * density * 32.2) / 144.0;
	
	
	var totalHeadLossPsi = headLossPsi + BPressureDrop + SPressureDrop + pheadLossPsi;
	var staticHead = ((density * 32.2 * height)/144);
	var pfCalc = parseFloat(atm) + parseFloat(staticHead) - parseFloat(totalHeadLossPsi) - parseFloat(npshrps);
	// old TVP formulas
	// var TVP = RVP * Math.pow(Math.E,(-6622.5 * ((1/((temperature*1.8021)+459.69)) - (1/559.69)))) + (.04*RVP) + (.1 * 27);
	// var TVP = ((0.7553 - (413/(temperature + 459.6))) * Math.pow(2.5, 0.5) * Math.log10(RVP)) - ((1.854 - (1.042/(temperature + 459.6))) * Math.pow(2.5, 0.5)) + (((2416/(temperature + 459.6)) - 2.013) * Math.log10(RVP)) - ((8.742/(temperature + 459.6)) + 15.64);
	var A = 9.4674 - (-0.9445 * Math.log(RVP));
    var B = 5211 - (16.014 * Math.log(RVP));
    var C = 459.67;
    var D = A-((B)/(parseFloat(temperature) + parseFloat(C)));
    var TVP = Math.exp(D);
	var VL = (atm - pfCalc)/(pfCalc - TVP);
	var VLratio = 1.0/(VL + 1);
	
	var ans = q*VLratio;
    document.getElementById("result").innerHTML = ans + " GPM ";
	document.getElementById("result2").innerHTML = "V/L:  " + (VL*100) + "%";
}

angular.module('flowApp', [])
  .controller('FlowListController', function() {
    var flowList = this;
    flowList.flows = [
      {text:'1', show: true},
	  {text:'2', show: false},
      {text:'3', show: false}];
  });
