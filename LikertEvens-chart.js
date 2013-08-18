// Chart design for T scores based on original bullet chart by Mike Bostock:
// http://bl.ocks.org/mbostock/4061961
// with d3.chart.js (0.1.2)
// http://misoproject.com/d3-chart/
d3.chart("LikertEvens", {
	initialize: function(options) {
		var mixins = this.mixins = [];
		var idx, len, mixin;
    var last = false;
    
		if (options && options.seriesCount) {
			for (idx = 0, len = options.seriesCount; idx < len; ++idx) {
        if( idx == len-1 ){
				  this._addSeries(idx,true);
        }else{
				  this._addSeries(idx,false);
        }
			}
		}
	},
	_addSeries: function(idx,last) {
		var mixin = this.mixin("LikertEven", this.base.append("svg")
      .attr("name", function(){
        if( last ){
          return "BaseSVG"
        }else{
          return "SVG"
        }
      })//"SVG")
      .append("g"));
      //.append("g")
      //.attr("id","row"+idx)
      //.attr("class","dark")
    // misoproject:
		// Cache the prototype's implementation of `transform` so that it may
		// be invoked from the overriding implementation. This is admittedly a
		// bit of a hack, and it may point to a future improvement for d3.chart
		var t = mixin.transform;

		mixin.transform = function(data) {
			return t.call(mixin, data[idx]);
		};

		this.mixins.push(mixin);
	},
	width: function(width) {
    var width, width_tmp;
		if (!arguments.length) {
			return this._width;
		}
    if (width.length == 1){ /* @CodeXmonk: now its horizontal */
      width_tmp = width[0];
    }else{ /* @CodeXmonk: a little more space needed for titles when it's vertical */
      width_tmp = width[0]+10;
    }
		this._width = width_tmp; 
		this.base.attr("width", width_tmp);
		var row = this.base.selectAll("svg").attr("width", width_tmp);
    //row.append("g").attr("width", width_tmp);
		this.mixins.forEach(function(mixin) {
			mixin.width(width);
		});
		return this;
	},
	height: function(height) {
    var height,height_tmp;
    height_tmp = height[0] + height[0]/2
		if (!arguments.length) {
			return this._height;
		}
		this._height = height[0]; 
		this.base.selectAll("svg").attr("height", height[0] );
		this.mixins.forEach(function(mixin) {
			mixin.height(height);
		});
		return this;
	},
	duration: function(duration) {
		if (!arguments.length) {
			return this._duration;
		}
		this._duration = duration;
		this.mixins.forEach(function(mixin) {
			mixin.duration(duration);
		});
	},
	margin: function(margin) {
		this.mixins.forEach(function(mixin) {
			mixin.margin(margin);
		});
		return this;
	} ,
	axisStyle: function(axisStyle) {
		/*this.mixins.forEach(function(mixin) {
			mixin.axisStyle(axisStyle);
		});*/
    var length = this.mixins.length,
    element = null;
    for (var i = 0; i < length; i++) {
      // Do something with element i.
        mixin = this.mixins[i];
      if( i==length-1 ){
        mixin.axisStyle(axisStyle);
      }else{
        mixin.axisStyle("noaxis");
      }
    }
		return this;
	}
});