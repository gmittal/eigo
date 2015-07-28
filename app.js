// Copyright 2015 Gautam Mittal under the MIT License

var dotenv = require('dotenv');
dotenv.load();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var fs = require('fs');
var greetings = require('greetings');
var request = require('request');
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

var writeGood = require('write-good');

var port = 3000;

app.use(bodyParser());
app.use(express.static(__dirname + '/email_templates'));

app.post('/check', function (req, res) {
  var googleDoc = req.body.url;
  var email = req.body.email;

  res.setHeader('Content-Type', 'application/json');

  console.log(googleDoc);
  console.log(email);

  // take in a google doc, spit out the contents
  request(googleDoc, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var lines = body.split("\n");

	    var c = cheerio.load(body);

	    if (c("meta:nth-child(3)")["0"]["attribs"]["content"] == "Google Docs") {
    		   
    		    for (var i = 0; i < lines.length; i++) {

			    	if (lines[i].indexOf("DOCS_modelChunk = [{") > -1) {
			    		// console.log(i);
			    		$ = cheerio.load(lines[i]);

			    		var scripts = $("script").text().split(";");

			    		for (var j = 0; j < scripts.length; j++) {
			    			if (scripts[j].indexOf("DOCS_modelChunk = [{") > -1) {
			    				// console.log(j);

			    				var objs = scripts[j].split("},");

			    				for (var k = 0; k < objs.length; k++) {
			    					if (objs[k].indexOf("DOCS_modelChunk = [{") > -1) {

			    						var json = (objs[k].replace('DOCS_modelChunk = ', '')) + "}]";

			    						var data = JSON.parse(json)[0].s; // the Google Docs contents

			    						var suggestions = writeGood(data); // lint the writing piece

			    						console.log(suggestions);

			    						var htmlString = data;

			    						var excess = 0;

			    						var suggestionsListString = "";

			    						for (var l = 0; l < suggestions.length; l++) {
			    							htmlString = htmlString.insert(suggestions[l].index + excess, '<span style="color:red; font-weight:bold;">');
			    							excess += '<span style="color:red; font-weight:bold;">'.length;

			    							htmlString = htmlString.insert(suggestions[l].index + suggestions[l].offset + excess, "</span>");
			    							excess += "</span>".length;

			    							suggestionsListString += "<li>" + suggestions[l].reason + "</li>";
			    						}


			    						htmlString = htmlString.replace(/\n/g, "<br />");
			    						// htmlString = urlify(htmlString); // to turn all of the hyperlinks into urls, except it doesn't have perfect regex matching

			    						// console.log(htmlString);

			    						fs.readFile("email_templates/template4.html", 'utf-8', function (err, fileData) {
			    							if (err) {
			    								res.send({"Error": "An error occurred."});
			    							} else {
			    								
			    								var finalData = fileData;
			    								finalData = fileData.replace("{USER-WORK-s6ZG5rnRHt4Ydg9O2fv7}", htmlString);
			    								finalData = finalData.replace("{SUGGESTION-LIST-CWwbXpU8BUyEdAYULIrC}", suggestionsListString);
			    								finalData = finalData.replace("{HEADER-MESSAGE-L4VTRRHMppErK8V07Bkq}", greetings.random);

					    						sendgrid.send({
												  to:       email,
												  from:     'Eigo@eigo-results-do-not-reply.io',
												  subject:  'Hello World',
												  html:     finalData
												}, function(err, json) {
												  if (err) { return console.error(err); }
												  console.log(json);
												});

			    								res.send({"Success": "Your results should be sent to your email now."});

			    							}
			    						});



			    						

			    					}
			    				}

			    			}
			    		}

			    		


			    	}
			    } // end for loop


	    } else {
	    	res.send({"Error": "An error occurred. The document you sent was not a valid Google Doc."});
	    } // end if Google Doc


	  } else {
	  	res.send({"Error": "An error occurred."});
	  }
  });

  

  

});


String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}


var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});