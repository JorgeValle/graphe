'use strict';

const request = require('request');
var apiOptions = {
	server: "http://localhost:3000"
};

var contentService = '../services/content_service.js';

if (process.env.NODE_ENV === 'production') {
	apiOptions.server = 'http://murmuring-earth-39282.herokuapp.com';
}

/**
 * get all from content type
 * @param {string} res - the test value
 * @param {string} status - the status response
 *
 */
module.exports.query = function(req, res) {

	var requestOptions, path;
	path = '/api/pages?sortby=descending';

	var fullUrl = apiOptions.server + path;

	requestOptions = {
		url: fullUrl,
		method: 'GET'
	};

	request(requestOptions, function(err, response, body) {

		if (err) {
			console.log("Request error" + err);
		} else {
			renderQueryContent(req, res, body);
		}

	});

};

var renderQueryContent = function(req, res, responseBody) {
	res.render('query', {
		documentTitle: 'Query Content | Antares CMS' ,
		// we parse JSON response to get properties ready for consumption in pug templates
		apiResponse: JSON.parse(responseBody)
	});
};

var renderUpdateContent = function(req, res, responseBody) {
	res.render('update', {
		documentTitle: 'Update Content | Antares CMS' ,
		// we parse JSON response to get properties ready for consumption in pug templates
		apiResponse: JSON.parse(responseBody)
	});
};

/* GET welcome page */
module.exports.index = function(req, res) {
	res.render('index', { 
		documentTitle: 'Welcome | Antares CMS'
	});
};

module.exports.create = function(req, res) {
	res.render('create', { 
		documentTitle: 'Create Page | Antares CMS'
	});
};

module.exports.createType = function(req, res) {
	res.render('create-type', { 
		documentTitle: 'Create Type | Antares CMS'
	});
};

module.exports.update = function(req, res) {

	const wantedSlug = req.query.page;

	var requestOptions, path;
	path = '/api/pages/' + wantedSlug;

	var fullUrl = apiOptions.server + path;

	requestOptions = {
		url: fullUrl,
		method: 'GET'
	};

	request(requestOptions, function(err, response, body) {

		if (err) {
			console.log("Request error" + err);
		} else {
			renderUpdateContent(req, res, body);
		}

	});
};