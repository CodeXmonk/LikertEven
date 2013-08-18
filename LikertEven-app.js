(function() {

"use strict";

function Data(){
  this.original =   [ 
    {"item":"a","percent":[4,5,10,11],"rowStyle":"dark","terjedelem":[-100,100],"dimension":["just for test","of people never do anykind of test","of people rarely test something","of people frequently test something","of people are always testing"]},
    {"item":"b","percent":[7,8,35,50],"rowStyle":"light","terjedelem":[-100,100],"dimension":["I'd recommend this program to a friend.","hate it","have forgot it","probably don't forget","definitely do"]},
    {"item":"c","percent":[10,15,30,45],"rowStyle":"dark","terjedelem":[-100,100],"dimension":["I learned a lot in this program.","slept like a log","learnt nothing new","become better people","take a new lease on life"]},
    {"item":"d","percent":[20,25,25,30],"rowStyle":"light","terjedelem":[-100,100],"dimension":["This program exceeded my expectations.","wish they have never fallen into line","didn't find anything new","were surprised","want to make it again"]},
    {"item":"e","percent":[50,50,50,50],"rowStyle":"dark","terjedelem":[-100,100],"dimension":["Likert choices (4-point)","Strongly disagree","Disagree","Strongly agree","Agree"]}
  ]
}
function TransformData(){
}

var getData = new Data();
var data = getData.original;

function LikertEven() {
	var myLikertEven = d3.select("#LikertEven").chart("LikertEvens", {
		seriesCount: data.length
	});
	myLikertEven.margin({ top: 0, right: 240, bottom: 5, left: 10 })
		.width([600])                        
		.height([40])
    .axisStyle("axis")
		.duration(1000);
	myLikertEven.draw(data);
  
	d3.selectAll("button#Randomize").on("click", function() {
    d3.selectAll(".textResult").remove();
    d3.selectAll(".textResultKiem").remove();
    var length = data.length,
    row = null;
    for (var i = 0; i < length-1; i++) {
      row = data[i];
      randomizeLikert(row.percent);
    }
	  myLikertEven.draw(data);
	});
  
	d3.selectAll("button#Reset").on("click", function() { 
    d3.selectAll(".textResult").remove();
    d3.selectAll(".textResultKiem").remove();
    getData = new Data();
    data = getData.original;
	  myLikertEven.draw(data);
	});
}

function randomizeLikert(d) {
  var total = 100;
  if (!d.randomizer) d.randomizer = randomizer(d);
  d[3] = d.randomizer(d[3],0,50);
  total -= d[3];
  d[2] = d.randomizer(d[2],0,total+1);
  total -= d[2];
  d[1] = d.randomizer(d[1],0,total+1);
  total -= d[1];
  d[0] = total;
  return d;
}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizer(d,min,max) {
  return function(d,min,max) {
    return getRandomInt(min,max);
  };
}

LikertEven();

})();