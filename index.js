const fs = require('fs');
const http = require('http');
const url = require('url');

// here only run once when start our application
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

// console.log(__dirname);
// console.log(json);

// 1. creates our server.
// 2. callback function: run each time that someone accesses our web server.
const server = http.createServer((req, res) => {
	// console.log('someone did access the server!');
	console.log(req.url);
	// anaylze url
	const request = url.parse(req.url, true);
	const pathname = request.pathname;
	const query = request.query;
	// /laptop?id=1
	const { id } = query;
	// PRODUCT OVERVIEW PAGE
	if (pathname === '/products' || pathname === '') {
		// response
		res.writeHead(200, { 'Content-type': 'text/html' });

		fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
			let overviewOutput = data;
			fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
				const cardsOutput = laptopData.map((el) => replaceTemplate(data, el)).join('');
				overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);

				res.end(overviewOutput);
			});
		});

		// res.end('this is the Products Page!');
	} else if (pathname === '/laptop' && id < laptopData.length) {
		// LAOPTOP DETAIL PAGE
		// response
		res.writeHead(200, { 'Content-type': 'text/html' });
		// asnyc read, not block main code
		fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
			const laptop = laptopData[id];
			const output = replaceTemplate(data, laptop);
			res.end(output);
		});
	} else if (/\.(jpg|jpeg|png|gif)$/i.test(pathname)) {
		// images
		fs.readFile(`${__dirname}/data/img${pathname}`, (err, data) => {
			res.writeHead(200, { 'Content-type': 'image/jpg' });
			res.end(data);
		});
	} else {
		// PAGE NOT FOUND
		res.writeHead(404, { 'Content-type': 'text/html' });
		res.end('Something went wrong! Not found on server');
	}
});

// 3. listen on a specific port and a specific IP address
server.listen(1337, '127.0.0.1', () => {
	console.log('listening for requests now');
});

function replaceTemplate(originalHTML, laptop) {
	let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
	output = output.replace(/{%IMAGE%}/g, laptop.image);
	output = output.replace(/{%PRICE%}/g, laptop.price);
	output = output.replace(/{%SCREEN%}/g, laptop.screen);
	output = output.replace(/{%CPU%}/g, laptop.cpu);
	output = output.replace(/{%STORAGE%}/g, laptop.storage);
	output = output.replace(/{%RAM%}/g, laptop.ram);
	output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
	output = output.replace(/{%ID%}/g, laptop.id);
	return output;
}
