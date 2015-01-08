var amqp = require('nimbus_amqp'),
	config = require('./config'),
	getCertInfo = require('./getCertInfo'),
	mongo = require('mongodb');

var amqp_global = null,
	amqp_create = {
		host: config.rabbitmq.host,
		queues: {}
	};
var db = new mongo.Db(config.mongodb.database, new mongo.Server(config.mongodb.host, config.mongodb.port, {}), {w:1});

var collection = null;

amqp_create.queues[config.rabbitmq.queue] = {
	on_message: function(msg, headers, deliveryInfo, message){
		// do stuff
		var url = msg.key;
		url = url.replace(/^www./,'')
		getCertInfo(url, function(certChain){
			if(certChain.length > 0){
				collection.insert({key: url, certs: certChain}, function(){
					message.acknowledge(false);
				});
			}
		});
		
	},
	prefectch_count: 20,
	ack: true,
	durable: true,
	autoDelete: false
};

amqp.factory(amqp_create, function(err, a){
	amqp_global = a;
	console.log('Connected to rabbitmq');
	db.open(function(err, client){
	    client.collection(config.mongodb.collection, function(err, col) {
	        collection = col;
	    });
	});
})