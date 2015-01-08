var request = require('request'),
	unzip = require('unzip'),
	csv2 = require('csv2'),
	amqp = require('amqp'),
	config = require('./config');

var connection = amqp.createConnection({host: config.rabbitmq.host, port: config.rabbitmq.port});
connection.on('ready', function(){
	console.log('RabbitMQ seems connected!');
});

request.get('http://s3.amazonaws.com/alexa-static/top-1m.csv.zip')
	   .pipe(unzip.Parse())
	   .on('entry', function(entry){
	   		entry.pipe(csv2())
	   			 .on('data', function(line){
	   			 	//console.log(line[1]);
	   			 	connection.publish(config.rabbitmq.queue, {"key": line[1]});
	   			 })
	   });