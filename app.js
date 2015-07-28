// Copyright 2015 Gautam Mittal under the MIT License

var dotenv = require('dotenv');
dotenv.load();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');
var sendgrid = require('sendgrid')(sendgrid_api_key);
var writeGood = require('write-good');

var port = 3000;

app.use(bodyParser());

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
			    		console.log(i);
			    		$ = cheerio.load(lines[i]);

			    		var scripts = $("script").text().split(";");

			    		for (var j = 0; j < scripts.length; j++) {
			    			if (scripts[j].indexOf("DOCS_modelChunk = [{") > -1) {
			    				console.log(j);

			    				var objs = scripts[j].split("},");

			    				for (var k = 0; k < objs.length; k++) {
			    					if (objs[k].indexOf("DOCS_modelChunk = [{") > -1) {

			    						var json = (objs[k].replace('DOCS_modelChunk = ', '')) + "}]";

			    						var data = JSON.parse(json)[0].s; // the Google Docs contents

			    						console.log(data);

			    						var suggestions = writeGood(data); // lint the writing piece

			    						console.log(suggestions);


			    						res.send({"Success": "Your results should be sent to your email now."});

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

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});