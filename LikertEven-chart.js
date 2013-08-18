// Chart design based on my BulleT that was based on original bullet chart by Mike Bostock:
// http://bl.ocks.org/mbostock/4061961
// with d3.chart.js (0.1.2)
// http://misoproject.com/d3-chart/
d3.chart("LikertEven", {
  initialize: function() {
    var chart = this;
    this.xScale = d3.scale.linear();
    this.tickFormat( function(d){return Math.abs(d)} );
    this.x0 = chart.xScale(0);
    this.axisStyle(function(d) {
      return d.axisStyle;
    }); 
    this.base.append("rect").attr("name","row_01").attr("class","background").attr("transform","translate(-10,0)");
    this.base.append("rect").attr("name","row_02").attr("class","background").attr("transform","translate(-10,0)");
    this.base.classed("LikertEven", true);
    this.titleGroup = this.base.append("g");
    this.title = this.titleGroup.append("text")
      .attr("class", "title"); 
    this.dimension = this.titleGroup.append("text")
      .attr("class", "subtitle s");
    this.subtitle = this.titleGroup.append("text");
    // Default configuration
    this._margin = { top: 0, right: 0, bottom: 0, left: 0 };
    this.duration(0);
    this.percent(function(d) {
      return d.percent;
    });
    this.width(100);
    this.height(40);
    this.reverse(false);
    this.orient("left");
    this.terjedelem(function(d) {
      return d.terjedelem;
    });
/******************************************************************************/
    this.layer("percent", this.base.append("g").classed("percent", true), {
      dataBind: function(data) {
        var data_percent = new Array();
        // @CodeXmonk: a bit of hack too - ToDo later.
        data_percent[0] = (data.percent[0]+data.percent[1])*(-1); // [-80,-45,20,40]
        data_percent[1] = data.percent[1]*(-1);
        data_percent[2] = data.percent[2]+data.percent[3];
        data_percent[3] = data.percent[2];
        return this.selectAll("rect.percent").data(data_percent);
      },
      insert: function() {
        return this.append("rect");
      },
      events: {
        enter: function(d, i) {
          var terjedelem = chart.terjedelem;
          this.attr("class", function(d, i) { return "percent s" + i; })
              .attr("height", chart.height())
              .attr("x", function(d,i) {
                if( d < 0 ){
                  return chart.xScale(d);
                }else{
                  return chart.xScale(0);
                } 
              }) 
              .attr("width", function(d, i) {
                return chart.xScale(Math.abs(d))-chart.xScale(0) ;
              })
              .attr("transform", "translate(" + 0 + ",0)" );
        },
        "merge:transition": function(d, i) {
          var terjedelem = chart.terjedelem;
          this.duration(chart.duration())
            .attr("x", function(d, i) {
              if( d < 0 ){
                return chart.xScale(d);
              }else{
                return chart.xScale(0);
              } 
            })
            .attr("width", function(d, i) {
              if( d < 0 ){
                return chart.xScale(Math.abs(d))-chart.xScale(0) ;
              }else{
                  return chart.xScale(Math.abs(d))-chart.xScale(0) ;
              }
            })
            .attr("transform", "translate(" + 0 + ",0)" );
          },
        exit: function() {
          this.remove();
        }
      }
    });
/******************************************************************************/
    this.layer("text", this.base.append("g").classed("text", true), {
      dataBind: function(data) {
        var data_percent = new Array();
        var dimension = data.dimension;
        var axisStyle = chart.axisStyle();
        // @CodeXmonk: a bit of hack too - ToDo later.
        data_percent[0] = new Array( (data.percent[0]+data.percent[1])*(-1), data.percent[0], dimension ); // [-80,-45,20,40]
        data_percent[1] = new Array( data.percent[1]*(-1), data.percent[1], dimension );
        data_percent[2] = new Array( data.percent[2]+data.percent[3], data.percent[3], dimension );
        data_percent[3] = new Array( data.percent[2], data.percent[2], dimension);
        return this.selectAll("text.text").data(data_percent);
      },
      insert: function() {
        return this.append("text");
      },
      events: {
        enter: function(d, i) {
          this.text( function(d,i) {
            var axisStyle = chart.axisStyle();
            if( axisStyle == "axis" ){
              return d[2][i+1];
            }else{
              switch (true)
              { 
                case ( d[1] < 5 ):
                  return "";
                  break;
                case ( 5 <= d[1] && d[1] < 11 ):
                  return Math.abs(d[1]);
                  break;
                default:
                  return Math.abs(d[1])+"%";
                  break;
              }
            } 
          });
          this.attr("class", function(d, i) {
            var axisStyle = chart.axisStyle();
              if( axisStyle == "axis" ){
                return "textResultKiem";
              }else{
                return "textResult";
              }
          })
          .attr("y", chart.height() - chart.height()/3)
          .attr("x", function(d, i) {
            return chart.xScale(d[0]); 
          })
          .attr("text-anchor", function(d, i) {
            if( d[0] < 0 ){
              return "start"; 
            }else{
              return "end";
            }
            //return chart.xScale(d); 
          })
          .attr("transform", function(d, i) {
            if( d[0] < 0 ){
              return "translate(" + 2 + ",0)";
            }else{
              return "translate(" + -2 + ",0)";
            }
          });
        },
        "merge:transition": function(d, i) {
          var terjedelem = chart.terjedelem;
          this.duration(chart.duration())
          .attr("x", function(d, i) {
            return chart.xScale(d[0]); 
          })
          .attr("text-anchor", function(d, i) {
            if( d[0] < 0 ){
              return "start"; 
            }else{
              return "end";
            }
            //return chart.xScale(d); 
          })
          .attr("transform", function(d, i) {
            if( d[0] < 0 ){
              return "translate(" + 2 + ",0)";
            }else{
              return "translate(" + -2 + ",0)";
            }
          });
        },
        exit: function() {
          this.remove();
        }
      }
    });
/******************************************************************************/
    this.layer("ticks", this.base.append("g").classed("ticks", true), {
      dataBind: function() {
        var format = this.chart().tickFormat();
        return this.selectAll("g.tick").data(this.chart().xScale.ticks(8), function(d) {
          return d;
        });
      },
      insert: function() {
        var tick = this.append("g").attr("class", "tick");
        var height =chart.height();
        var format = chart.tickFormat();
        tick.append("line")
          .attr("y1", chart.height())
          .attr("y2", chart.height() * 7 / 6);
        tick.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr("y", chart.height() * 7 / 6)
          .text(format);
        return tick;
      },
      events: {
        enter: function(d) {  
          var axisStyle = chart.axisStyle();
          this.attr("transform", function(d) {
            return "translate(" + chart.xScale(d) + ",0)";
          })
          .style("opacity", function(d){
            if( axisStyle == "axis" ){
              return 1;
            }else{
              return 0;
            }
          });
        },
        "merge:transition": function(d) { 
        var axisStyle = chart.axisStyle();
          this.duration(chart.duration())
          .attr("transform", function(d) {
            return "translate(" + chart.xScale(d) + ",0)";
          })
          .style("opacity", function(d){
            if( axisStyle == "axis" ){
              return 1;
            }else{
              return 0;
            }
          });
          this.select("line")
            .attr("y1", chart.height())
            .attr("y2", chart.height() * 7 / 6);
          this.select("text")
            .attr("y", chart.height() * 7 / 6);
        },
        "exit:transition": function() {
          this.duration(chart.duration())
            .attr("transform", function(d) {
              return "translate(" + chart.xScale(d) + ",0)";
            })
            .style("opacity", 1e-6)
            .remove();
        }
      }
    });
    
    d3.timer.flush();
  },                                                                     

  transform: function(data) {
    var height = this.height();
    // misoproject: Copy data before sorting
    var newData = {
      title: data.title,
      dimension: data.dimension,
      randomizer: data.randomizer,
      terjedelem: data.terjedelem.slice(),
      percent: data.percent, 
      item: data.item,
      rowStyle: data.rowStyle
    };
    this.xScale.domain([newData.terjedelem[0], newData.terjedelem[1]]);
    var axisStyle = this.axisStyle();
    if( axisStyle == "axis" ){
      var axis = this.base.append("g");
      this.xAxis = axis.append("line")
      this.xAxis.attr("class", function(d) {
        return axisStyle;
      })
      .attr("x1",0)
      .attr("x2",this.xScale(100))
      .attr("y1",this.height())
      .attr("y2",this.height());
    }else{
      var select_tmp = d3.selectAll("[name=SVG]");
      select_tmp.attr("height",25);
    }  
    this.titleGroup
      .style("text-anchor", "start" );
    this.titleGroup.attr("transform", "translate(" + this.xScale(110) + ",0)");
    this.dimension
      .attr("dy", "1.0em");
    this.subtitle
      .attr("dy", "2.3em");
    if( axisStyle == "axis" ){  
      this.dimension.attr("class", "dimTextKiem");
      this.dimension.text(data.dimension[0]);
    }else{
      var greatest;
      var indexOfGreatest;
      var array = data.percent;
      for (var i = 0; i < array.length; i++) {
        if (!greatest || array[i] > greatest) {
          greatest = array[i];
          indexOfGreatest = i;
        }
      }
      this.dimension.text(data.dimension[0]); 
      this.subtitle.text(data.percent[indexOfGreatest] + "% " + data.dimension[indexOfGreatest+1]);
      this.subtitle.attr("class","subtitle s"+indexOfGreatest);
    }
    this.base.selectAll("rect.background").attr("class","background "+data.rowStyle);
    return newData;
  },

  // misoproject: reverse or not
  reverse: function(x) {
		if (!arguments.length) return this._reverse;
		this._reverse = x;
		return this;
	},

	// misoproject: left, right, top, bottom
	orient: function(x) {
		if (!arguments.length) return this._orient;
		this._orient = x;
		this._reverse = this._orient == "right" || this._orient == "bottom";
		return this;
	},
  
	axisStyle: function(x) {
		if (!arguments.length) return this._axisStyle;
		this._axisStyle = x;
		return this;
	}, 

	// @CodeXmonk: terjedelem (20,80)
	terjedelem: function(x) {
		if (!arguments.length) return this._terjedelem;
		this._terjedelem = x;
		return this;
	},
  
	percent: function(x) {
		if (!arguments.length) return this._percent;
		this._percent = x;
		return this;
	},
  
	width: function(x) {
		var margin, width_tmp;
		if (!arguments.length) {
			return this._width;
		}
		margin = this.margin(); 
    width_tmp = x[0];
		width_tmp = width_tmp - (margin.left + margin.right);
		this._width = width_tmp; 
		this.xScale.range(this._reverse ? [width_tmp, 0] : [0, width_tmp]);
		this.base.attr("width", width_tmp);
    this.base.selectAll("rect").attr("width",x[0])
    this.base.selectAll("[name=row_02]").attr("width",function(){return 370;});
		return this;
	},
  
	height: function(x) {
		var margin, height_tmp;
		if (!arguments.length) {
			return this._height;
		}
		margin = this.margin();
    height_tmp = x[0]; 
     
    
		height_tmp = height_tmp - (margin.top + margin.bottom)-10;
		this._height = height_tmp;
		this.base.attr("height", height_tmp);
		this.titleGroup.attr("transform", "translate(-16," + height_tmp / 3 + ")");
    this.base.selectAll("[name=row_01]").attr("height",function(){
      if( this._height ){
        return this._height;
      }else{
        return 14;
      }
    });
    this.base.selectAll("[name=row_02]").attr("height",function(){
      if( this._height ){
        return this._height;
      }else{
        return 25;
      }
    });
		return this;
	},
  
	margin: function(margin) {
		if (!margin) {
			return this._margin;
		}
    var margin_tmp = margin;
		["top", "right", "bottom", "left"].forEach(function(dimension) {
			if (dimension in margin_tmp) {
				this._margin[dimension] = margin_tmp[dimension];
			}
		}, this);
		this.base.attr("transform", "translate(" + this._margin.left + "," + this._margin.top + ")");
		return this;
	},

	tickFormat: function(x) {
		if (!arguments.length) return this._tickFormat;
		this._tickFormat = x;
		return this;
	},  

	orientation: function(x) {
		if (!arguments.length) return this._orientation;
		this._orientation = x;
		return this;
	},

	duration: function(x) {
		if (!arguments.length) return this._duration;
		this._duration = x;
		return this;
	}
});