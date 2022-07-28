
function get_column(list, col) {

    var return_col = [];

    for (var i = 0; i < list.length; ++i){
        return_col.push(list[i][col]);
    }

    return return_col;
}


function popularity_chart(data) {


	function NMoveAvg(context, N) { // from: https://stackoverflow.com/questions/41386083/plot-rolling-moving-average-in-d3-js-v4/41388581#41388581
      this._context = context;
      this._points = {
        x: [],
        y: []
      };
      this._N = N;
    }
	NMoveAvg.prototype = {
		areaStart: function() {
			this._line = 0;
		},
		areaEnd: function() {
			this._line = NaN;
		},
		lineStart: function() {
			this._point = 0;
		},
		lineEnd: function() {
			if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
			this._line = 1 - this._line;
		},
		point: function(x, y) {
			x = +x, y = +y;

			this._points.x.push(x);
			this._points.y.push(y);

			if (this._points.x.length < this._N) return;

			var aX = this._points.x.reduce(function(a, b) {
				return a + b;
			}, 0) / this._N,
			aY = this._points.y.reduce(function(a, b) {
				return a + b;
			}, 0) / this._N;

			this._points.x.shift();
			this._points.y.shift();

			switch (this._point) {
			case 0:
				this._point = 1;
				this._line ? this._context.lineTo(aX, aY) : this._context.moveTo(aX, aY);
				break;
			case 1:
				this._point = 2; // proceed
			default:
				this._context.lineTo(aX, aY);
				break;
			}
		}
		};

	var	formatDate = d3.timeFormat("%m/%e/%Y");
	var	bisectDate = d3.bisector(d => d.date).left;

	var party_colors = ['rgb(60,163,36)', 'rgb(24,69,137)', 'rgb(245,88,157)', 'rgb(219,0,28)', 'rgb(184,206,67)', 'rgb(255,215,0)', 'rgb(28,169,233)', 'rgb(237,0,140)', 'rgb(248,234,13)', '#999']
	var party_colors_a = ['rgb(60,163,36,0.1)', 'rgb(24,69,137,0.1)', 'rgb(245,88,157,0.1)', 'rgb(219,0,28,0.1)', 'rgb(184,206,67,0.1)', 'rgb(255,215,0,0.1)', 'rgb(28,169,233,0.1)', 'rgb(237,0,140,0.1)', 'rgb(248,234,13,0.1)', 'rgb(60,60,60,0.1)']
	var z = d3.scaleOrdinal(party_colors);
    var z_a = d3.scaleOrdinal(party_colors_a);

	data.forEach(function(dt) {
			dt['date'] = d3.timeParse("%m/%e/%Y")(dt['Fieldwork_date']),
			dt['Polling_firm'] = dt['Polling_firm'],
			dt['CDP'] = +dt['CDP'],
			dt['DPP'] = +dt['DPP'],
			dt['Ishin'] = +dt['Ishin'],
			dt['JCP'] = +dt['JCP'],
			dt['LDP'] = +dt['LDP'],
			dt['N-Koku'] = +dt['N-Koku'],
			dt['NKP'] = +dt['NKP'],
			dt['No_party'] = +dt['No_party'],
			dt['Reiwa'] = +dt['Reiwa'],
			dt['Others'] = +dt['Others'],
			dt['SDP'] = +dt['SDP']
		});

	var svg = d3.select("#chart");
	var margin = {top: 50, right: 50, bottom: 50, left: 50};
	var	width = +(svg.attr("width") - margin.left - margin.right);
	var	height = +(svg.attr("height") - margin.top - margin.bottom);

	var x = d3.scaleTime()
		.rangeRound([margin.left, width - margin.right])
		.domain(d3.extent(data, function(d) { return d.date; }))

	var y = d3.scaleLinear()
		.rangeRound([height - margin.bottom, margin.top]);

	var curveNMoveAge = (function custom(N) { // from: https://stackoverflow.com/questions/41386083/plot-rolling-moving-average-in-d3-js-v4/41388581#41388581

		function nMoveAge(context) {
			return new NMoveAvg(context, N);
		}

		nMoveAge.N = function(N) {
		return custom(+N);
		};

		return nMoveAge;
		})(0);

	var poll_line = d3.line()
		.curve(curveNMoveAge.N(15))
		.x(d => x(d.date))
		.y(d => y(d.poll));


	var focus = svg.append("g")
		.attr("class", "focus")
		.style("display", "none");

	focus.append("line").attr("class", "lineHover")
		.style("stroke", "#777")
		.attr("stroke-width", 1)
		.style("opacity", 0.5)
		.attr("y1", -height)
		.attr("y2",0);

	focus.append("text").attr("class", "lineHoverDate")
		.attr("text-anchor", "middle")
		.attr("font-size", 12);

	svg.append("rect")
		.attr("class", "overlay")
		.attr("x", margin.left)
		.attr("width", width - margin.right - margin.left)
		.attr("height", height)

	place_points(0);

	function place_points(speed) {

		svg.append("g")
		.attr("class","x-axis")
		.attr("transform", "translate(0," + (height - margin.bottom) + ")")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b%y")))
        .call(g => g.append("text")
            .attr("x", width/2)
            .attr("y", margin.bottom + 10)
            .attr("fill", "currentColor")
            .attr('class', 'axis_label')
            .attr("text-anchor", "middle")
            .text("Date"))

		svg.append("g")
			.attr("class", "y-axis")
			.attr("transform", "translate(" + margin.left + ",0)")
            .call(g => g.append("text")
                .attr("x", -30)
                .attr("y", height/2)
                .attr('class', 'axis_label')
                .attr('style', 'writing-mode:vertical-rl')
                .attr("fill", "currentColor")
                .attr("text-anchor", "middle")
                .text("Poll Results (%)"));


		var cols_to_graph = ['LDP', 'CDP', 'NKP', 'JCP', 'Ishin', 'DPP', 'SDP', 'Reiwa', 'N-Koku', 'Others']
		var polling_data = cols_to_graph.map(function(id) {
			return {
				id: id,
				values: data.map(function(d) {return {date: d.date, poll: +d[id]}})
			};
		});		

		y.domain([
			d3.min(polling_data, d => d3.min(d.values, c => c.poll)),
			d3.max(polling_data, d => d3.max(d.values, c => c.poll))
		]).nice();

		svg.selectAll(".y-axis").transition()
			.duration(speed)
			.call(d3.axisLeft(y).tickSize(-width + margin.right + margin.left))

		var pollingd = svg.selectAll(".polling_data")
			.data(polling_data);

		pollingd.exit().remove();

		pollingd.enter().insert("g", ".focus").append("path")
			.attr("class", "line polling_data")
			.style("stroke", function(d) {return z(d.id)})
			.merge(pollingd)
		.transition().duration(speed)
			.attr("d", function(d) {return poll_line(d.values)})

		// Scatter plot
		cols_to_graph.forEach(function(item, ind) {

			svg.append("g")
			.selectAll("dot")
			.data(data)
			.enter()
			.append("circle")
				.attr("class", "party_scatter")
				.attr("cx", function(dt) { return x(dt.date) } )
				.attr("cy", function(dt) { return y(dt[item]) } )
				.attr("r", 2.5)
				.attr("fill", party_colors_a[ind])
			});

		// Annotations

		const annotations = [
			{
				note: { label: "Shinzo Abe announces resignation as prime minister"},
				subject: {
					y1: margin.top,
					y2: height - margin.bottom
				},
				dy: margin.top,
				dx: x(new Date("8/28/2020"))+3
			},
			{
				note: { label: "Nationally unpopular Tokyo Olympics end"},
				subject: {
					y1: margin.top,
					y2: height - margin.bottom
				},
				dy: margin.top,
				dx: x(new Date("7/23/2021"))+3
			},
			{
				note: { label: "Moritomo Gakuen scandal implicates Abe"},
				subject: {
					y1: margin.top,
					y2: height - margin.bottom
				},
				dy: margin.top,
				dx: x(new Date("2/15/2018"))+3
			}
		];

		// Annotation lines
		svg.append('line')
			.attr('class', 'dotted')
			.style("stroke", "black")
			.attr("x1", x(new Date("8/28/2020")))
			.attr("y1", height-50)
			.attr("x2", x(new Date("8/28/2020")))
			.attr("y2", ); 

		svg.append('line')
			.attr('class', 'dotted')
			.style("stroke", "black")
			.attr("x1", x(new Date("7/23/2021")))
			.attr("y1", height-50)
			.attr("x2", x(new Date("7/23/2021")))
			.attr("y2", 0); 

		svg.append('line')
			.attr('class', 'dotted')
			.style("stroke", "black")
			.attr("x1", x(new Date("2/15/2018")))
			.attr("y1", height-50)
			.attr("x2", x(new Date("2/15/2018")))
			.attr("y2", 0); 


		const makeAnnotations = d3.annotation()
		.annotations(annotations)
		d3.select("#chart")
		.append("g")
		.call(makeAnnotations);

		tooltip(cols_to_graph);
	}

	function tooltip(cols_to_graph) {
		
		var labels = focus.selectAll(".lineHoverText")
			.data(cols_to_graph)

		labels.enter().append("text")
			.attr("class", "lineHoverText")
			.style("fill", d => z(d))
			.attr("text-anchor", "start")
			.attr("font-size",12)
			.attr("dy", (_, i) => 1 + i * 2 + "em")
			.merge(labels);

		var circles = focus.selectAll(".hoverCircle")
			.data(cols_to_graph)

		circles.enter().append("circle") //blank cirles for the hover to latch onto
			.attr("class", "hoverCircle")
			.style("fill", d => z_a(d))
			.attr("r", 0)
			.merge(circles);

		svg.selectAll(".overlay")
			.on("mouseover", function() { focus.style("display", null); })
			.on("mouseout", function() { focus.style("display", "none"); })
			.on("mousemove", mousemove);

		function mousemove() {

			var x0 = x.invert(d3.mouse(this)[0]),
				i = bisectDate(data, x0, 1),
				d0 = data[i - 1],
				d1 = data[i],
				d = x0 - d0.date > d1.date - x0 ? d1 : d0;

			focus.select(".lineHover")
				.attr("transform", "translate(" + x(d.date) + "," + height + ")");

			focus.select(".lineHoverDate")
				.attr("transform", 
					"translate(" + x(d.date) + "," + (height + margin.bottom) + ")")
				.text(formatDate(d.date));

			focus.selectAll(".hoverCircle")
				.attr("cy", e => y(d[e]))
				.attr("cx", x(d.date));

			focus.selectAll(".lineHoverText")
				.attr("transform", 
					"translate(" + (x(d.date)) + "," + height / 2.5 + ")")
				.text(e => e + " " + d3.format(",.01f")(d[e]) +"%");

			x(d.date) > (width - width / 4) 
				? focus.selectAll("text.lineHoverText")
					.attr("text-anchor", "end")
					.attr("dx", -10)
				: focus.selectAll("text.lineHoverText")
					.attr("text-anchor", "start")
					.attr("dx", 10)
		}
	}

}

function parliment_chart(data, year){

	data.forEach(function(dt) {
			dt['Prefecture'] = dt['Prefecture'],
			dt['CDP'] = +dt['CDP'],
			dt['DPP'] = +dt['DPP'],
			dt['Ishin'] = +dt['ISHIN'],
			dt['JCP'] = +dt['JCP'],
			dt['LDP'] = +dt['LDP'],
			dt['N-Koku'] = +dt['N-Koku'],
			dt['NKP'] = +dt['NKP'],
			dt['Reiwa'] = +dt['Reiwa'],
			dt['Others'] = +dt['Others/Independents'],
			dt['SDP'] = +dt['SDP']
		});

	var svg = d3.select("#chart");
	var margin = {top: 50, right: 50, bottom: 50, left: 50};
	var	width = +(svg.attr("width") - margin.left - margin.right);
	var	height = +(svg.attr("height") - margin.top - margin.bottom);

	var PR_data = data.slice(data.length-11)
	var parl_data = data.slice(0,data.length-11)
	// console.log(PR_data, parl_data)	

	var party_colors = ['rgb(60,163,36)', 'rgb(24,69,137)', 'rgb(245,88,157)', 'rgb(219,0,28)', 'rgb(184,206,67)', 'rgb(255,215,0)', 'rgb(28,169,233)', 'rgb(237,0,140)', '#999']

    function get_centers(year){
        if(year == 2017){ // change centers
            return [[250, 400, 325, 400, 600, 600, 425, 200, 550],  [150, 400, 100, 430, 150, 200, 400, 350, 150]];
        }
    
        if(year == 2021){
            return [[250, 400, 350, 400, 600, 400, 425, 375, 450], [150, 400, 100, 430, 150, 350, 400, 350, 400]];
        }
    }

    var centers = get_centers(year)

	var xCenter = centers[0]
	var yCenter = centers[1]

    console.log(yCenter, centers[1])

	var parties = ['LDP', 'CDP', 'NKP', 'JCP', 'Ishin', 'DPP', 'SDP', 'Reiwa', 'Others'] // for readability
	var radius = 4

	function get_node_list(arr, party, cat){
		var col = get_column(arr, party)
		var pref = get_column(arr, 'Prefecture')
		var node_location = []

		for (let i=0; i < col.length; i++){
			var temp_arr = []
				for (let k=0; k<col[i]; k++){
					temp_arr.push(pref[i])
				}
			node_location = node_location.concat(temp_arr)
		}

		var numNodes = col.reduce((a, b) => a + b, 0); //gets sum of array
		var nodes = d3.range(numNodes).map(function(d) {
			return {
				radius: radius,
				category: cat,
				party: party,
				color: party_colors[cat],
				location: 'None'
			}
		});

		if (node_location.length > 0){
			for (let i=0; i < (nodes.length); i++){
				nodes[i]['location'] = node_location[i]
			}
		}

		return nodes
	}
	
	var nodes = get_node_list(data, 'LDP', 0) //TODO: put in a loop
	.concat(get_node_list(data, 'CDP', 1))
	.concat(get_node_list(data, 'NKP', 2))
	.concat(get_node_list(data, 'JCP', 3))
	.concat(get_node_list(data, 'Ishin', 4))
	.concat(get_node_list(data, 'DPP', 5))
	.concat(get_node_list(data, 'SDP', 6))
	.concat(get_node_list(data, 'Reiwa', 7))
	.concat(get_node_list(data, 'Others', 8))

	console.log(nodes)

	var node = svg.selectAll('.node').data(nodes).enter().append('g')
	
	node.append('circle')
	.attr('class', 'node')
	.attr('r', radius)
	.attr('fill', function(d) {return d.color})
	.style('opacity', 0.5)
	.on('mouseover', force_mouseover)
	.on("mouseout", force_mouseout)

	node.append('title').text(function(d){
        if (d.location.slice(-2) == 'PR'){
            return d.party + " proportionally represented from " + d.location.slice(0, -3)
        }
        return d.party + " elected official from " + d.location
    })

	// add a label to each node
    node.append("text")
        .attr("dx", 10)
        .text(function(d) {return d.location;})
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .style("fill", 'black')
		.style('display', 'none')
		.style('border', '2px solid black');

	// node.append('text').text('test').style("stroke", "black")
    //     .style("stroke-width", 0.5)
    //     .style("fill", 'black')

	var simulation = d3.forceSimulation()
		.force('charge', d3.forceManyBody().strength(1))
		.force('x', d3.forceX().x(function(d) {
			return xCenter[d.category];
		}))
		.force('y', d3.forceY().y(function(d) {
			return yCenter[d.category];
		}))
		.force('collision', d3.forceCollide(radius));

	function tick() {
		node.attr('transform', tick_move)

		function tick_move(d){ 
			// keep the node within the boundaries of the svg
			if (d.x < 0) {
				d.x = 0
			};
			if (d.y < 0) {
				d.y = 0
			};
			if (d.x > width) {
				d.x = width
			};
			if (d.y > height) {
				d.y = height
			};
			return "translate(" + d.x + "," + d.y + ")";
		}
	}

	function force_mouseover() {
		d3.select(this).transition()
			.duration(500)
			.attr("r", 8)
			.style('opacity', 1);

		d3.select(this.parentNode).select('text')
		.style('display', 'block')
		.style('padding', '2ex')
		.style('position', 'absolute')
		.style('z-index', 1);
	}

	function force_mouseout() {
		d3.select(this).transition()
			.duration(500)
			.attr("r", radius)
			.style('opacity', 0.5);
		

		d3.select(this.parentNode).select('text')
		.style('display', 'none');
	}

	simulation.nodes(nodes).on('tick', tick);



    if(year == 2017){
        annotation_2017()
    }

    if(year == 2021){
        annotation_2021()
    }

    function annotation_2017(){
        svg.append("circle").attr("cx",800).attr("cy",130).attr("r", 4).style("fill", "rgb(60,163,36)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",150).attr("r", 4).style("fill", "rgb(24,69,137)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",170).attr("r", 4).style("fill", "rgb(245,88,157)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",190).attr("r", 4).style("fill", "rgb(219,0,28)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",210).attr("r", 4).style("fill", "rgb(184,206,67)").style('opacity', 0.5)
        // svg.append("circle").attr("cx",800).attr("cy",230).attr("r", 4).style("fill", "rgb(255,215,0)")
        svg.append("circle").attr("cx",800).attr("cy",230).attr("r", 4).style("fill", "rgb(28,169,233)").style('opacity', 0.5)
        // svg.append("circle").attr("cx",800).attr("cy",270).attr("r", 4).style("fill", "rgb(237,0,140)")
        svg.append("circle").attr("cx",800).attr("cy",250).attr("r", 4).style("fill", "#999").style('opacity', 0.5)
        svg.append("text").attr("x", 810).attr("y", 130).text("LDP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 150).text("CDP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 170).text("NKP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 190).text("JCP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 210).text("Ishin").style("font-size", "15px").attr("alignment-baseline","middle")
        // svg.append("text").attr("x", 810).attr("y", 230).text("DPP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 230).text("SDP").style("font-size", "15px").attr("alignment-baseline","middle")
        // svg.append("text").attr("x", 810).attr("y", 270).text("Reiwa").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 250).text("Others").style("font-size", "15px").attr("alignment-baseline","middle")


        const annotations = [
			{
				note: { label: "Ruling coalition containing the LDP and Komeito (NKP)"},
				dy: 240,
				dx: 170
			},
            {
				note: { label: "Koike's coalition pushing for LDP to lose power"},
				dy: 215,
				dx: 490
			},
            {
				note: { label: "Pacifist coalition working with Koike's coalition to oppose the Ruling coalition"},
				dy: 450,
				dx: 350
			},
		];

        // Annotation L's
        drawn_L(170,330,100,235) // ruling coalition

        drawn_L(490,600,100,210) // ruling coalition

        drawn_L(350,450,350,445) // Pacifist coalition	


		const makeAnnotations = d3.annotation()
		.annotations(annotations)
		d3.select("#chart")
		.append("g")
		.call(makeAnnotations);

    }

    function annotation_2021(){
        // Legend
        svg.append("circle").attr("cx",800).attr("cy",130).attr("r", 4).style("fill", "rgb(60,163,36)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",150).attr("r", 4).style("fill", "rgb(24,69,137)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",170).attr("r", 4).style("fill", "rgb(245,88,157)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",190).attr("r", 4).style("fill", "rgb(219,0,28)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",210).attr("r", 4).style("fill", "rgb(184,206,67)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",230).attr("r", 4).style("fill", "rgb(255,215,0)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",250).attr("r", 4).style("fill", "rgb(28,169,233)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",270).attr("r", 4).style("fill", "rgb(237,0,140)").style('opacity', 0.5)
        svg.append("circle").attr("cx",800).attr("cy",290).attr("r", 4).style("fill", "#999").style('opacity', 0.5)
        svg.append("text").attr("x", 810).attr("y", 130).text("LDP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 150).text("CDP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 170).text("NKP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 190).text("JCP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 210).text("Ishin").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 230).text("DPP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 250).text("SDP").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 270).text("Reiwa").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 290).text("Others").style("font-size", "15px").attr("alignment-baseline","middle")


        
        const annotations = [
			{
				note: { label: "Ruling coalition containing the LDP and Komeito (NKP)"},
				dy: 240,
				dx: 180
			},
            {
				note: { label: "Regional party from Osaka in its own coalition"},
				dy: 200,
				dx: 545
			},
            {
				note: { label: "Opposition coalition working with primarily against ruling coalition"},
				dy: 455,
				dx: 340
			},
		];

        // Annotation L's
        drawn_L(180,355,80,235) // ruling coalition

        drawn_L(545,620,120,195) // other coalition

        drawn_L(340,475,325,450) // Pacifist coalition	


		const makeAnnotations = d3.annotation()
		.annotations(annotations)
		d3.select("#chart")
		.append("g")
		.call(makeAnnotations);
    }

    function drawn_L(x1,x2,y1,y2){
        svg.append('line') 
			.style("stroke", "black")
			.attr("x1", x1)
			.attr("y1", y1)
			.attr("x2", x1)
			.attr("y2", y2);

        svg.append('line')
			.style("stroke", "black")
			.attr("x1", x1)
			.attr("y1", y2)
			.attr("x2", x2)
			.attr("y2", y2);

    }


}
