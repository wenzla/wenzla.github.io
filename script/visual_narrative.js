
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

	// function get_column(list, col) {

	// 		var return_col = [];

	// 		for (var i = 0; i < list.length; ++i){
	// 			return_col.push(list[i][col]);
	// 		}

	// 		return return_col;
	// 	}

	var	formatDate = d3.timeFormat("%m/%e/%Y");
	var	bisectDate = d3.bisector(d => d.date).left;

	var party_colors = ['rgb(60,163,36)', 'rgb(24,69,137)', 'rgb(245,88,157)', 'rgb(219,0,28)', 'rgb(184,206,67)', 'rgb(255,215,0)', 'rgb(28,169,233)', 'rgb(237,0,140)', 'rgb(248,234,13)', 'black']
	var party_colors_a = ['rgb(60,163,36,0.1)', 'rgb(24,69,137,0.1)', 'rgb(245,88,157,0.1)', 'rgb(219,0,28,0.1)', 'rgb(184,206,67,0.1)', 'rgb(255,215,0,0.1)', 'rgb(28,169,233,0.1)', 'rgb(237,0,140,0.1)', 'rgb(248,234,13,0.1)', 'rgb(0,0,0,0.1)']
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
		.style("stroke", "#999")
		.attr("stroke-width", 1)
		.style("shape-rendering", "crispEdges")
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

